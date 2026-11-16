
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
import numpy as np
import os

# ==========================================
# FILE PATHS
# ==========================================

folder = "data/raw"

expression_file = os.path.join(
    folder,
    "GLDS-13_array_normalized_expression_probeset_GLmicroarray.csv"
)

differential_file = os.path.join(
    folder,
    "GLDS-13_array_differential_expression_GLmicroarray.csv"
)

# Check files
if not os.path.exists(expression_file):
    raise FileNotFoundError(expression_file)

if not os.path.exists(differential_file):
    raise FileNotFoundError(differential_file)

# ==========================================
# LOAD NASA DATA
# ==========================================

print("\nLoading NASA OSD-13 data...")

expression_df = pd.read_csv(expression_file, low_memory=False)
diff_df = pd.read_csv(differential_file, low_memory=False)

print("Expression records:", len(expression_df))
print("Differential expression records:", len(diff_df))

# Main comparison: 1G activated vs microgravity activated
comparison = (
    "(Space Flight & 1G by centrifugation & Activated)"
    "v(Space Flight & uG & Activated)"
)

logfc_col = "Log2fc_" + comparison
pval_col = "P.value_" + comparison
adj_col = "Adj.p.value_" + comparison

# ==========================================
# DIFFERENTIAL EXPRESSION ANALYSIS
# ==========================================

significant = diff_df[
    diff_df[adj_col] < 0.05
].copy()

higher_1g = (significant[logfc_col] > 0).sum()
higher_ug = (significant[logfc_col] < 0).sum()

annotated = significant.dropna(subset=["SYMBOL"]).copy()
annotated = annotated[
    annotated["SYMBOL"].astype(str).str.strip() != ""
]

annotated = annotated.sort_values(adj_col)

unique_genes = annotated.drop_duplicates(
    subset=["SYMBOL"]
)

print("\n========== ANALYSIS SUMMARY ==========")
print("Total records tested:", len(diff_df))
print("Significant records:", len(significant))
print("Higher expression in 1G:", higher_1g)
print("Higher expression in microgravity:", higher_ug)
print("Significant records with gene symbols:", len(annotated))
print("Unique annotated gene symbols:", unique_genes["SYMBOL"].nunique())

print("\nTop 15 significant genes:")

print(
    unique_genes[
        ["SYMBOL", "GENENAME", logfc_col, adj_col]
    ].head(15).to_string(index=False)
)

# Save significant gene results
unique_genes.to_csv(
    os.path.join(folder, "OSD13_unique_gene_summary.csv"),
    index=False
)

# ==========================================
# VISUALIZATION 1: VOLCANO PLOT
# ==========================================

print("\nGenerating volcano plot...")

volcano_df = diff_df.dropna(
    subset=[logfc_col, adj_col]
).copy()

volcano_df = volcano_df[
    volcano_df[adj_col] > 0
]

volcano_df["neg_log10_p"] = -np.log10(
    volcano_df[adj_col]
)

plt.figure(figsize=(10, 6))

plt.scatter(
    volcano_df[logfc_col],
    volcano_df["neg_log10_p"],
    alpha=0.5
)

plt.axhline(
    -np.log10(0.05),
    linestyle="--",
    label="Adjusted p-value = 0.05"
)

plt.axvline(1, linestyle="--", label="Log2FC = 1")
plt.axvline(-1, linestyle="--", label="Log2FC = -1")

plt.xlabel("Log2 Fold Change (1G vs Microgravity)")
plt.ylabel("-Log10 Adjusted P-value")
plt.title("OSD-13 Gene Expression Volcano Plot")
plt.legend()

plt.tight_layout()

plt.savefig(
    os.path.join(folder, "OSD13_volcano_plot.png"),
    dpi=300
)

plt.show()

# ==========================================
# VISUALIZATION 2: GENE EXPRESSION HEATMAP
# ==========================================

print("\nGenerating gene expression heatmap...")

selected_genes = [
    "NR4A3", "NFKBID", "EGR3", "NR4A2",
    "NR4A1", "EGR1", "MAFF", "TAGAP",
    "IER2", "IL3", "TNFSF14", "MYC"
]

sample_columns = [
    col for col in expression_df.columns
    if col.startswith("Hsap_Tcells_")
]

heatmap_data = expression_df[
    expression_df["SYMBOL"].isin(selected_genes)
].copy()

heatmap_data = heatmap_data.groupby(
    "SYMBOL"
)[sample_columns].mean()

# Row-wise Z-score normalization
heatmap_data = heatmap_data.sub(
    heatmap_data.mean(axis=1),
    axis=0
).div(
    heatmap_data.std(axis=1).replace(0, 1),
    axis=0
)

plt.figure(figsize=(13, 7))

sns.heatmap(
    heatmap_data,
    cmap="coolwarm",
    center=0,
    linewidths=0.3,
    annot=False
)

plt.title("OSD-13 T Cell Gene Expression Heatmap")
plt.xlabel("Experimental Samples")
plt.ylabel("Genes")

plt.tight_layout()

plt.savefig(
    os.path.join(folder, "OSD13_gene_heatmap.png"),
    dpi=300
)

plt.show()

# ==========================================
# VISUALIZATION 3: TOP 15 GENE BAR CHART
# ==========================================

print("\nGenerating top 15 gene bar chart...")

top_genes = unique_genes.head(15).copy()

top_genes = top_genes.sort_values(logfc_col)

plt.figure(figsize=(11, 7))

plt.barh(
    top_genes["SYMBOL"],
    top_genes[logfc_col]
)

plt.xlabel("Log2 Fold Change (1G vs Microgravity)")
plt.ylabel("Genes")
plt.title("Top 15 Differentially Expressed Genes - OSD-13")

plt.tight_layout()

plt.savefig(
    os.path.join(folder, "OSD13_top15_genes.png"),
    dpi=300
)

plt.show()

# ==========================================
# COMPLETION
# ==========================================

print("\n========== ANALYSIS COMPLETED ==========")

print("Generated files:")

print("1. OSD13_unique_gene_summary.csv")
print("2. OSD13_volcano_plot.png")
print("3. OSD13_gene_heatmap.png")
print("4. OSD13_top15_genes.png")

print("\nAll results saved in:", folder)




# ============================================================
# NASA OSD-140: DNA METHYLATION ANALYSIS
# ============================================================

import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
from pathlib import Path

print("\nLoading NASA OSD-140 methylation data...")

# Existing project data folder
BASE_DIR = Path(__file__).resolve().parent.parent
DATA_DIR = BASE_DIR / "data" / "raw"

# Find extracted OSD-140 sample files
sample_files = sorted(DATA_DIR.glob("GSM15848*_sample_table.txt"))

if len(sample_files) == 0:
    print("No OSD-140 sample files found!")
else:
    methylation_data = {}

    for file in sample_files:
        sample_name = file.name.replace("_sample_table.txt", "")

        df = pd.read_csv(file, sep="\t")

        df["VALUE"] = pd.to_numeric(df["VALUE"], errors="coerce")
        df["Detection Pval"] = pd.to_numeric(
            df["Detection Pval"], errors="coerce"
        )

        df = df.dropna(subset=["Reporter Identifier", "VALUE"])

        methylation_data[sample_name] = df.set_index(
            "Reporter Identifier"
        )["VALUE"]

        print(f"{sample_name}: {len(df)} CpG measurements")

    # Combine samples using their common CpG identifiers
    methylation_matrix = pd.DataFrame(methylation_data)

    print("\n========== OSD-140 ANALYSIS SUMMARY ==========")
    print("Total CpG sites:", len(methylation_matrix))
    print("Number of samples:", len(methylation_matrix.columns))

    print("\nMissing values:")
    print(methylation_matrix.isnull().sum())

    print("\nMethylation statistics:")
    print(methylation_matrix.describe())

    # Save combined methylation matrix
    methylation_matrix.to_csv(
        DATA_DIR / "OSD140_methylation_matrix.csv"
    )

    # Calculate sample-to-sample correlation
    correlation = methylation_matrix.corr()

    correlation.to_csv(
        DATA_DIR / "OSD140_sample_correlation.csv"
    )

    # Visualize methylation distributions
    plt.figure(figsize=(10, 6))

    for column in methylation_matrix.columns:
        plt.hist(
            methylation_matrix[column].dropna(),
            bins=40,
            alpha=0.5,
            label=column
        )

    plt.xlabel("DNA Methylation Beta Value")
    plt.ylabel("Number of CpG Sites")
    plt.title("OSD-140 DNA Methylation Distribution")
    plt.legend()
    plt.tight_layout()

    plt.savefig(DATA_DIR / "OSD140_methylation_distribution.png")
    plt.close()

    # Visualize sample correlations
    plt.figure(figsize=(7, 6))

    plt.imshow(correlation, vmin=-1, vmax=1, cmap="coolwarm")
    plt.colorbar(label="Correlation")

    plt.xticks(
        range(len(correlation.columns)),
        correlation.columns,
        rotation=45
    )
    plt.yticks(range(len(correlation.index)), correlation.index)

    plt.title("OSD-140 Sample Correlation")
    plt.tight_layout()

    plt.savefig(DATA_DIR / "OSD140_sample_correlation.png")
    plt.close()

    print("\nOSD-140 analysis completed!")
    print("Generated:")
    print("1. OSD140_methylation_matrix.csv")
    print("2. OSD140_sample_correlation.csv")
    print("3. OSD140_methylation_distribution.png")
    print("4. OSD140_sample_correlation.png")

# ============================================================
# OSD-140: LONGITUDINAL COMPARISON (CREW MEMBER 5)
# ============================================================

print("\nComparing DNA methylation: Day -7 vs Day 60...")

sample_before = "GSM1584801"
sample_day60 = "GSM1584802"

if sample_before in methylation_matrix.columns and sample_day60 in methylation_matrix.columns:

    comparison = pd.DataFrame({
        "Day_minus_7": methylation_matrix[sample_before],
        "Day_60": methylation_matrix[sample_day60]
    }).dropna()

    # Calculate change in methylation beta value
    comparison["Change"] = (
        comparison["Day_60"] - comparison["Day_minus_7"]
    )

    comparison["Absolute_Change"] = comparison["Change"].abs()

    print("\n========== LONGITUDINAL COMPARISON ==========")
    print("Common CpG sites:", len(comparison))
    print("Mean methylation at Day -7:",
          comparison["Day_minus_7"].mean())
    print("Mean methylation at Day 60:",
          comparison["Day_60"].mean())
    print("Mean change:",
          comparison["Change"].mean())

    print("\nTop 20 CpG sites with largest absolute changes:")

    top_changes = comparison.sort_values(
        "Absolute_Change", ascending=False
    ).head(20)

    print(top_changes)

    # Save results
    comparison.to_csv(
        DATA_DIR / "OSD140_day_minus7_vs_day60.csv"
    )

    top_changes.to_csv(
        DATA_DIR / "OSD140_top20_methylation_changes.csv"
    )

    # Scatter plot: methylation before vs during isolation
    plt.figure(figsize=(8, 7))

    plt.scatter(
        comparison["Day_minus_7"],
        comparison["Day_60"],
        alpha=0.25,
        s=5
    )

    plt.plot([0, 1], [0, 1], linestyle="--")

    plt.xlabel("Methylation Beta Value (Day -7)")
    plt.ylabel("Methylation Beta Value (Day 60)")
    plt.title("OSD-140: DNA Methylation Before vs During Isolation")

    plt.xlim(0, 1)
    plt.ylim(0, 1)
    plt.tight_layout()

    plt.savefig(
        DATA_DIR / "OSD140_day_minus7_vs_day60.png",
        dpi=300
    )
    plt.close()

    print("\nLongitudinal comparison completed!")
    print("Generated:")
    print("1. OSD140_day_minus7_vs_day60.csv")
    print("2. OSD140_top20_methylation_changes.csv")
    print("3. OSD140_day_minus7_vs_day60.png")

else:
    print("Required OSD-140 samples were not found.")




# ============================================================
# OSD-140: FULL LONGITUDINAL ANALYSIS (ALL 6 CREW MEMBERS)
# ============================================================

print("\nStarting full OSD-140 longitudinal analysis...")

# Six crew members in the order used in NASA sample metadata
crew_ids = [5, 3, 1, 6, 2, 4]
timepoints = [-7, 60, 168, 300, 512, 527]

# Create metadata for all 36 samples
metadata = []

for i in range(36):
    sample_number = 1584801 + i
    crew = crew_ids[i // 6]
    day = timepoints[i % 6]

    metadata.append({
        "Sample": f"GSM{sample_number}",
        "Crew": crew,
        "Day": day
    })

sample_metadata = pd.DataFrame(metadata)
sample_metadata.to_csv(
    DATA_DIR / "OSD140_sample_metadata.csv",
    index=False
)

# Check that all 36 samples are available
available_samples = [
    sample for sample in sample_metadata["Sample"]
    if sample in methylation_matrix.columns
]

if len(available_samples) != 36:
    print(
        f"Expected 36 samples, but found {len(available_samples)}."
    )
else:
    # Overall average methylation for each sample
    sample_means = methylation_matrix.mean(axis=0)

    sample_summary = sample_metadata.copy()
    sample_summary["Mean_Beta"] = sample_summary["Sample"].map(
        sample_means
    )

    sample_summary.to_csv(
        DATA_DIR / "OSD140_sample_mean_methylation.csv",
        index=False
    )

    # Average sample-level methylation at each timepoint
    timepoint_summary = (
        sample_summary.groupby("Day")["Mean_Beta"]
        .agg(["mean", "std"])
        .reset_index()
    )

    timepoint_summary.columns = [
        "Day", "Mean_Beta", "Std_Beta"
    ]

    timepoint_summary.to_csv(
        DATA_DIR / "OSD140_timepoint_summary.csv",
        index=False
    )

    # --------------------------------------------------------
    # Compare each crew member with their own baseline (Day -7)
    # --------------------------------------------------------

    crew_changes = {}

    for crew in crew_ids:
        crew_samples = sample_metadata[
            sample_metadata["Crew"] == crew
        ]

        baseline_sample = crew_samples[
            crew_samples["Day"] == -7
        ]["Sample"].iloc[0]

        baseline_values = methylation_matrix[baseline_sample]

        for day in timepoints[1:]:
            current_sample = crew_samples[
                crew_samples["Day"] == day
            ]["Sample"].iloc[0]

            current_values = methylation_matrix[current_sample]

            change = current_values - baseline_values

            crew_changes[(crew, day)] = change

    # Average baseline-relative changes across six crew members
    change_results = {}

    for day in timepoints[1:]:
        changes_for_day = pd.concat(
            [
                crew_changes[(crew, day)]
                for crew in crew_ids
            ],
            axis=1
        )

        change_results[f"Day_{day}"] = changes_for_day.mean(axis=1)

    change_matrix = pd.DataFrame(change_results)
    change_matrix.index.name = "CpG_Site"

    change_matrix.to_csv(
        DATA_DIR / "OSD140_CpG_change_from_baseline.csv"
    )

    # Rank CpG sites by their largest absolute average change
    change_matrix["Maximum_Absolute_Change"] = (
        change_matrix.abs().max(axis=1)
    )

    top_changes = change_matrix.sort_values(
        "Maximum_Absolute_Change",
        ascending=False
    ).head(20)

    top_changes.to_csv(
        DATA_DIR / "OSD140_top20_longitudinal_CpG_changes.csv"
    )

    # --------------------------------------------------------
    # Plot 1: Overall methylation across timepoints
    # --------------------------------------------------------

    plt.figure(figsize=(9, 5))

    plt.errorbar(
        timepoint_summary["Day"],
        timepoint_summary["Mean_Beta"],
        yerr=timepoint_summary["Std_Beta"],
        marker="o",
        capsize=5
    )

    plt.xlabel("Study Day")
    plt.ylabel("Mean DNA Methylation Beta Value")
    plt.title("OSD-140: Average DNA Methylation Across Time")
    plt.grid(alpha=0.3)
    plt.tight_layout()

    plt.savefig(
        DATA_DIR / "OSD140_timepoint_trend.png",
        dpi=300
    )
    plt.close()

    # --------------------------------------------------------
    # Plot 2: Individual crew member trajectories
    # --------------------------------------------------------

    plt.figure(figsize=(10, 6))

    for crew in crew_ids:
        crew_data = sample_summary[
            sample_summary["Crew"] == crew
        ].sort_values("Day")

        plt.plot(
            crew_data["Day"],
            crew_data["Mean_Beta"],
            marker="o",
            label=f"Crew {crew}"
        )

    plt.xlabel("Study Day")
    plt.ylabel("Mean DNA Methylation Beta Value")
    plt.title("OSD-140: Methylation Trends by Crew Member")
    plt.legend()
    plt.grid(alpha=0.3)
    plt.tight_layout()

    plt.savefig(
        DATA_DIR / "OSD140_crew_comparison.png",
        dpi=300
    )
    plt.close()

    # --------------------------------------------------------
    # Plot 3: Average CpG changes relative to baseline
    # --------------------------------------------------------

    average_changes = change_matrix.drop(
        columns="Maximum_Absolute_Change"
    ).mean()

    plt.figure(figsize=(9, 5))

    plt.plot(
        timepoints[1:],
        average_changes.values,
        marker="o"
    )

    plt.axhline(0, linestyle="--")
    plt.xlabel("Study Day")
    plt.ylabel("Average Change in Beta Value")
    plt.title("OSD-140: Methylation Change from Baseline")
    plt.grid(alpha=0.3)
    plt.tight_layout()

    plt.savefig(
        DATA_DIR / "OSD140_baseline_change_trend.png",
        dpi=300
    )
    plt.close()

    print("\n========== FULL LONGITUDINAL ANALYSIS ==========")
    print("\nTimepoint summary:")
    print(timepoint_summary.to_string(index=False))

    print("\nAverage CpG change from baseline:")
    print(average_changes)

    print("\nTop 20 CpG sites with largest average changes:")
    print(top_changes.head(20).to_string())

    print("\nFull OSD-140 longitudinal analysis completed!")
