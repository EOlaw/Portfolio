import pandas as pd
import seaborn as sns
import matplotlib.pyplot as plt
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LogisticRegression
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import classification_report, roc_auc_score, roc_curve
import json
import sys
import base64
import io
import os

# Get the current directory of the script
current_dir = os.path.dirname(os.path.realpath(__file__))
# Construct the path to the CSV file
csv_file_path = os.path.join(current_dir, '..', 'data', 'telecom_customer_data.csv')

# Print current working directory and constructed file path
print("Current working directory:", os.getcwd())
print("Script directory:", current_dir)
print("CSV file path:", csv_file_path)

# Load data
df = pd.read_csv(csv_file_path)

# Data Preprocessing
def preprocess_data(df):
    df['TotalCharges'] = pd.to_numeric(df['TotalCharges'], errors='coerce')
    df['TotalCharges'].fillna(df['TotalCharges'].mean(), inplace=True)

    categorical_columns = ['gender', 'Partner', 'Dependents', 'PhoneService', 'MultipleLines', 
                           'InternetService', 'OnlineSecurity', 'OnlineBackup', 'DeviceProtection', 
                           'TechSupport', 'StreamingTV', 'StreamingMovies', 'Contract', 
                           'PaperlessBilling', 'PaymentMethod']
    df = pd.get_dummies(df, columns=categorical_columns, drop_first=True)

    df['Churn'] = df['Churn'].apply(lambda x: 1 if x == 'Yes' else 0)
    return df

df = preprocess_data(df)

def perform_eda(df):
    stats_summary = df.describe().to_html()

    # Correlation matrix
    plt.figure(figsize=(12, 8))
    sns.heatmap(df.corr(), annot=True, fmt='.2f', cmap='coolwarm')
    img_buf = io.BytesIO()
    plt.savefig(img_buf, format='png')
    plt.close()
    img_buf.seek(0)
    correlation_matrix = base64.b64encode(img_buf.getvalue()).decode('utf-8')

    # Distribution of target variable
    sns.countplot(x='Churn', data=df)
    plt.title('Churn Distribution')
    img_buf = io.BytesIO()
    plt.savefig(img_buf, format='png')
    plt.close()
    img_buf.seek(0)
    churn_distribution = base64.b64encode(img_buf.getvalue()).decode('utf-8')

    # Pairplot for selected features
    selected_features = ['tenure', 'MonthlyCharges', 'TotalCharges', 'Churn']
    sns.pairplot(df[selected_features], hue='Churn', palette='coolwarm')
    img_buf = io.BytesIO()
    plt.savefig(img_buf, format='png')
    plt.close()
    img_buf.seek(0)
    pairplot = base64.b64encode(img_buf.getvalue()).decode('utf-8')

    return stats_summary, correlation_matrix, churn_distribution, pairplot

def feature_engineering(df):
    df['MonthlyChargesPerTenure'] = df['MonthlyCharges'] / (df['tenure'] + 1)
    features = df.drop(['customerID', 'Churn'], axis=1)
    target = df['Churn']
    return features, target

def build_and_evaluate_model(df):
    features, target = feature_engineering(df)
    X_train, X_test, y_train, y_test = train_test_split(features, target, test_size=0.3, random_state=42)

    log_reg = LogisticRegression(max_iter=1000)
    rf_clf = RandomForestClassifier(n_estimators=100)

    log_reg.fit(X_train, y_train)
    rf_clf.fit(X_train, y_train)

    log_reg_pred = log_reg.predict(X_test)
    rf_clf_pred = rf_clf.predict(X_test)

    log_reg_report = classification_report(y_test, log_reg_pred, output_dict=True)
    rf_clf_report = classification_report(y_test, rf_clf_pred, output_dict=True)

    return log_reg_report, rf_clf_report

def visualize_model_performance(df):
    features, target = feature_engineering(df)
    X_train, X_test, y_train, y_test = train_test_split(features, target, test_size=0.3, random_state=42)

    log_reg = LogisticRegression(max_iter=1000)
    rf_clf = RandomForestClassifier(n_estimators=100)

    log_reg.fit(X_train, y_train)
    rf_clf.fit(X_train, y_train)

    log_reg_probs = log_reg.predict_proba(X_test)[:, 1]
    rf_clf_probs = rf_clf.predict_proba(X_test)[:, 1]

    log_reg_fpr, log_reg_tpr, _ = roc_curve(y_test, log_reg_probs)
    rf_clf_fpr, rf_clf_tpr, _ = roc_curve(y_test, rf_clf_probs)

    plt.figure(figsize=(10, 6))
    plt.plot(log_reg_fpr, log_reg_tpr, label='Logistic Regression')
    plt.plot(rf_clf_fpr, rf_clf_tpr, label='Random Forest')
    plt.plot([0, 1], [0, 1], 'k--')
    plt.xlabel('False Positive Rate')
    plt.ylabel('True Positive Rate')
    plt.title('ROC Curve')
    plt.legend()
    img_buf = io.BytesIO()
    plt.savefig(img_buf, format='png')
    plt.close()
    img_buf.seek(0)
    roc_curve_img = base64.b64encode(img_buf.getvalue()).decode('utf-8')

    return roc_curve_img

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python analysis.py [eda | build_model | visualize]")
        sys.exit(1)
    
    action = sys.argv[1]
    if action == 'eda':
        stats_summary, correlation_matrix, churn_distribution, pairplot = perform_eda(df)
        result = {
            'stats_summary': stats_summary,
            'correlation_matrix': correlation_matrix,
            'churn_distribution': churn_distribution,
            'pairplot': pairplot
        }
        print(json.dumps(result))
    elif action == 'build_model':
        log_reg_report, rf_clf_report = build_and_evaluate_model(df)
        result = {
            'log_reg_report': log_reg_report,
            'rf_clf_report': rf_clf_report
        }
        print(json.dumps(result))
    elif action == 'visualize':
        roc_curve_img = visualize_model_performance(df)
        result = {
            'roc_curve_img': roc_curve_img
        }
        print(json.dumps(result))
    else:
        print("Invalid action. Use 'eda', 'build_model', or 'visualize'.")
        sys.exit(1)