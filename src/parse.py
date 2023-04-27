import csv
import os
import math

# Read the input file
with open("commodities.csv", "r", encoding="utf-8") as f:
    csv_reader = csv.reader(f)
    data = [row for row in csv_reader]

# Process the data
processed_data = []

for i, row in enumerate(data):
    if i == 0:
        # Skip the header row
        processed_data.append(row)
        continue
    
    # Check if the row has any missing or invalid data
    if any(cell.strip() == "" or cell == "NaN" for cell in row[1:]):
        print("invalid", row[0])
        continue
    
    # Convert date to decremental consecutive number
    date_num = len(data) - i - 1

    # Convert all percentages to float
    float_row = [float(cell.strip('%')) / 100 if cell != "" else math.nan for cell in row[1:]]

    # Skip the row if it contains any NaN values
    if any(math.isnan(val) for val in float_row):
        print("nan", row[0])
        continue

    processed_data.append([date_num, row[0]] + float_row)

# Write the processed data to a new file
with open(os.path.join('data', "pcommodities.csv"), "w", newline='', encoding="utf-8") as f:
    csv_writer = csv.writer(f)
    csv_writer.writerows(processed_data)
