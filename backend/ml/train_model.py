"""Train and persist the SafeSakhi crime-zone classifier.

The source of truth is backend/data/city_safety_scores.csv.  ``Safety Zone`` is
the target because it is the existing category used by the backend data and
the map (the CSV does not contain a separate incident-level outcome).
"""

from __future__ import annotations

import argparse
import json
from datetime import datetime, timezone
from pathlib import Path

import joblib
import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.impute import SimpleImputer
from sklearn.metrics import accuracy_score, classification_report, confusion_matrix
from sklearn.model_selection import train_test_split
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler


ROOT = Path(__file__).resolve().parents[1]
DEFAULT_DATASET = ROOT / "data" / "city_safety_scores.csv"
DEFAULT_ARTIFACT = Path(__file__).resolve().parent / "artifacts" / "crime_risk_model.joblib"
DEFAULT_METADATA = Path(__file__).resolve().parent / "artifacts" / "crime_risk_model.json"
TARGET = "Safety Zone"
# Safe Score is derived from the crime data and is used by the existing
# application to assign Safety Zone, so using it would leak the target.
EXCLUDED_COLUMNS = {"City", TARGET, "Safe Score"}


def build_pipeline() -> Pipeline:
    """Build a deterministic, serialisable preprocessing/classifier pipeline."""

    return Pipeline(
        steps=[
            (
                "preprocess",
                Pipeline(
                    steps=[
                        ("imputer", SimpleImputer(strategy="median")),
                        # Scaling is not required by a forest, but keeps the
                        # preprocessing contract explicit for future models.
                        ("scaler", StandardScaler()),
                    ]
                ),
            ),
            (
                "classifier",
                RandomForestClassifier(
                    n_estimators=300,
                    class_weight="balanced",
                    random_state=42,
                    n_jobs=-1,
                ),
            ),
        ]
    )


def train(
    dataset_path: Path = DEFAULT_DATASET,
    artifact_path: Path = DEFAULT_ARTIFACT,
    metadata_path: Path = DEFAULT_METADATA,
) -> dict:
    dataset_path = Path(dataset_path).resolve()
    artifact_path = Path(artifact_path).resolve()
    metadata_path = Path(metadata_path).resolve()
    frame = pd.read_csv(dataset_path)
    if TARGET not in frame.columns:
        raise ValueError(f"Dataset must contain the {TARGET!r} target column")

    feature_columns = [
        column
        for column in frame.columns
        if column not in EXCLUDED_COLUMNS
    ]
    if not feature_columns:
        raise ValueError("Dataset does not contain numeric crime features")

    features = frame[feature_columns].apply(pd.to_numeric, errors="coerce")
    if features.isna().all(axis=None):
        raise ValueError("Crime feature columns do not contain numeric values")
    target = frame[TARGET].astype(str).str.strip()

    x_train, x_test, y_train, y_test = train_test_split(
        features,
        target,
        test_size=0.30,
        random_state=42,
        stratify=target,
    )
    model = build_pipeline()
    model.fit(x_train, y_train)
    predictions = model.predict(x_test)
    labels = list(model.named_steps["classifier"].classes_)

    report = classification_report(
        y_test,
        predictions,
        labels=labels,
        output_dict=True,
        zero_division=0,
    )
    metrics = {
        "accuracy": round(float(accuracy_score(y_test, predictions)), 4),
        "classification_report": report,
        "confusion_matrix": confusion_matrix(
            y_test, predictions, labels=labels
        ).tolist(),
        "test_rows": int(len(y_test)),
        "train_rows": int(len(y_train)),
    }
    metadata = {
        "model": "RandomForestClassifier",
        "target": TARGET,
        "features": feature_columns,
        "classes": labels,
        "dataset": str(dataset_path.relative_to(ROOT)),
        "rows": int(len(frame)),
        "trained_at": datetime.now(timezone.utc).isoformat(),
        "metrics": metrics,
    }

    artifact_path.parent.mkdir(parents=True, exist_ok=True)
    joblib.dump(
        {
            "model": model,
            "features": feature_columns,
            "target": TARGET,
            "metadata": metadata,
        },
        artifact_path,
    )
    metadata_path.write_text(json.dumps(metadata, indent=2) + "\n", encoding="utf-8")
    return metadata


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--dataset", type=Path, default=DEFAULT_DATASET)
    parser.add_argument("--artifact", type=Path, default=DEFAULT_ARTIFACT)
    parser.add_argument("--metadata", type=Path, default=DEFAULT_METADATA)
    args = parser.parse_args()
    metadata = train(args.dataset, args.artifact, args.metadata)
    print(json.dumps(metadata, indent=2))


if __name__ == "__main__":
    main()
