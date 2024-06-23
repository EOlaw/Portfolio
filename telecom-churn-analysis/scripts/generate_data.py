import pandas as pd
import numpy as np
import os

# Set the number of records
num_records = 1000

# Generate customerID
customer_ids = [f"{np.random.randint(1000, 9999)}-{np.random.choice(['VHVEG', 'GNVDE', 'QPYBK', 'MOTEO', 'HZTQW'])}" for _ in range(num_records)]

# Generate gender
genders = np.random.choice(['Male', 'Female'], num_records)

# Generate SeniorCitizen
senior_citizens = np.random.choice([0, 1], num_records, p=[0.84, 0.16])

# Generate Partner
partners = np.random.choice(['Yes', 'No'], num_records)

# Generate Dependents
dependents = np.random.choice(['Yes', 'No'], num_records)

# Generate tenure
tenures = np.random.randint(0, 73, num_records)

# Generate PhoneService
phone_services = np.random.choice(['Yes', 'No'], num_records)

# Generate MultipleLines
multiple_lines = np.random.choice(['Yes', 'No', 'No phone service'], num_records)

# Generate InternetService
internet_services = np.random.choice(['DSL', 'Fiber optic', 'No'], num_records)

# Generate OnlineSecurity
online_securities = np.random.choice(['Yes', 'No', 'No internet service'], num_records)

# Generate OnlineBackup
online_backups = np.random.choice(['Yes', 'No', 'No internet service'], num_records)

# Generate DeviceProtection
device_protections = np.random.choice(['Yes', 'No', 'No internet service'], num_records)

# Generate TechSupport
tech_supports = np.random.choice(['Yes', 'No', 'No internet service'], num_records)

# Generate StreamingTV
streaming_tvs = np.random.choice(['Yes', 'No', 'No internet service'], num_records)

# Generate StreamingMovies
streaming_movies = np.random.choice(['Yes', 'No', 'No internet service'], num_records)

# Generate Contract
contracts = np.random.choice(['Month-to-month', 'One year', 'Two year'], num_records)

# Generate PaperlessBilling
paperless_billings = np.random.choice(['Yes', 'No'], num_records)

# Generate PaymentMethod
payment_methods = np.random.choice(['Electronic check', 'Mailed check', 'Bank transfer (automatic)', 'Credit card (automatic)'], num_records)

# Generate MonthlyCharges
monthly_charges = np.round(np.random.uniform(20, 120, num_records), 2)

# Generate TotalCharges
total_charges = np.round(monthly_charges * tenures, 2)
total_charges[tenures == 0] = monthly_charges[tenures == 0]  # Ensure TotalCharges are valid for zero tenure

# Generate Churn
churns = np.random.choice(['Yes', 'No'], num_records, p=[0.26, 0.74])  # Assuming an average churn rate

# Create DataFrame
data = {
    'customerID': customer_ids,
    'gender': genders,
    'SeniorCitizen': senior_citizens,
    'Partner': partners,
    'Dependents': dependents,
    'tenure': tenures,
    'PhoneService': phone_services,
    'MultipleLines': multiple_lines,
    'InternetService': internet_services,
    'OnlineSecurity': online_securities,
    'OnlineBackup': online_backups,
    'DeviceProtection': device_protections,
    'TechSupport': tech_supports,
    'StreamingTV': streaming_tvs,
    'StreamingMovies': streaming_movies,
    'Contract': contracts,
    'PaperlessBilling': paperless_billings,
    'PaymentMethod': payment_methods,
    'MonthlyCharges': monthly_charges,
    'TotalCharges': total_charges,
    'Churn': churns
}

df = pd.DataFrame(data)

# Specify the absolute path to the data directory in telecom-churn-analysis
data_dir = '/Users/eolawale/Documents/GitHub/Portfolio/telecom-churn-analysis/data'

# Ensure the 'data' directory exists
os.makedirs(data_dir, exist_ok=True)

# Save DataFrame to CSV in the specified directory
file_path = os.path.join(data_dir, 'telecom_customer_data.csv')
df.to_csv(file_path, index=False)
print("Data saved to:", file_path)
