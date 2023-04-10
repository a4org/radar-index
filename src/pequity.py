import csv

# Read the input file
with open("commodities.csv", "r") as f:
    csv_reader = csv.reader(f)
    data = [row for row in csv_reader]

# Process the data
processed_data = []

for i, row in enumerate(data):
    if i == 0:
        # Skip the header row
        processed_data.append(row)
        continue
    # Convert date to decremental consecutive number
    date_num = len(data) - i - 1

    # Convert all percentages to float
    float_row = [float(cell.strip('%')) / 100 for cell in row[1:]]

    processed_data.append([date_num, row[0]] + float_row)

# Write the processed data to a new file
with open("pcommodities.csv", "w", newline='') as f:
    csv_writer = csv.writer(f)
    csv_writer.writerows(processed_data)
