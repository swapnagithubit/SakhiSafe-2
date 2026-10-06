"""Load the persisted crime-risk model and emit JSON predictions.

This small CLI is intentionally used by the Express controller instead of
duplicating a scikit-learn model in JavaScript. It accepts a city from the
trusted CSV, an explicit feature object, or emits predictions for every city.
"""

from __future__ import annotations

import argparse
import json
from pathlib import Path

import joblib
import pandas as pd


ML_DIR = Path(__file__).resolve().parent
ROOT = ML_DIR.parent
DATASET = ROOT / "data" / "city_safety_scores.csv"
ARTIFACT = ML_DIR / "artifacts" / "crime_risk_model.joblib"


def load_bundle():
    if not ARTIFACT.exists():
        raise FileNotFoundError(
            f"Model artifact not found at {ARTIFACT}. Run `npm run ml:train` first."
        )
    return joblib.load(ARTIFACT)


def prediction_for_row(bundle: dict, row: pd.Series) -> dict:
    features = bundle["features"]
    values = pd.DataFrame(
        [{feature: pd.to_numeric(row.get(feature), errors="coerce") for feature in features}]
    )
    model = bundle["model"]
    label = str(model.predict(values)[0])
    probabilities = model.predict_proba(values)[0]
    classes = model.named_steps["classifier"].classes_
    return {
        "prediction": label,
        "probabilities": {
            str(name): round(float(probability), 4)
            for name, probability in zip(classes, probabilities)
        },
    }


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    group = parser.add_mutually_exclusive_group(required=True)
    group.add_argument("--city")
    group.add_argument("--all", action="store_true")
    group.add_argument("--features", help="JSON object containing model features")
    args = parser.parse_args()

    bundle = load_bundle()
    frame = pd.read_csv(DATASET)
    metadata = bundle.get("metadata", {})

    if args.all:
        predictions = []
        for _, row in frame.iterrows():
            result = prediction_for_row(bundle, row)
            predictions.append(
                {
                    "city": str(row["City"]),
                    **result,
                }
            )
        print(json.dumps({"model": metadata, "predictions": predictions}))
        return

    if args.features:
        try:
            feature_values = json.loads(args.features)
        except json.JSONDecodeError as error:
            raise ValueError("Features must be valid JSON") from error
        if not isinstance(feature_values, dict):
            raise ValueError("Features must be a JSON object")
        row = pd.Series(feature_values)
        print(
            json.dumps(
                {
                    "model": metadata,
                    **prediction_for_row(bundle, row),
                }
            )
        )
        return

    city = frame[frame["City"].str.casefold() == args.city.strip().casefold()]
    if city.empty:
        raise ValueError(f"City not found: {args.city}")
    row = city.iloc[0]
    print(
        json.dumps(
            {
                "model": metadata,
                "city": str(row["City"]),
                **prediction_for_row(bundle, row),
            }
        )
    )


if __name__ == "__main__":
    main()
