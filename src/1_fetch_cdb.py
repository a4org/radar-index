import os
from google.oauth2 import service_account
from googleapiclient.discovery import build
import pandas as pd


# Set up API credentials
KEY_FILE = 'cash-radar-credentials.json'
SCOPES = ['https://www.googleapis.com/auth/spreadsheets','https://www.googleapis.com/auth/drive','https://www.googleapis.com/auth/drive.file']
creds = service_account.Credentials.from_service_account_file(KEY_FILE, scopes=SCOPES)

# Initialize APIs
sheets_api = build('sheets', 'v4', credentials=creds)
drive_api = build('drive', 'v3', credentials=creds)


COMMENT = '1_RZFcRl_Ks2D3bF4m4302299Bcxh1HVHisdbfjibxOU' # ID of the CDB0.00 Daily Commentaries
COMMODITIES = '1rUvfpKxOBLne4xx_eXfgoQ5j5uPFeO4uU4LIz5i2sg0' # ID of the CDB0.02 Commodities

def download_sheet(download_name, sheet_id, output_folder, sheet_name):
    result = sheets_api.spreadsheets().values().get(spreadsheetId=sheet_id, range=sheet_name).execute()
    data = result.get('values', [])
    if not data:
        print('No data found in {download_name}')
    else:
        df = pd.DataFrame(data[1:], columns=data[0])
        df.to_csv(os.path.join(output_folder, f'{download_name}.csv'), index=False)
        print(f'Downloaded {download_name} to {output_folder}')

if __name__ == '__main__':
    download_sheet("commentaries", COMMENT, '.', "sheet1")
    download_sheet("commodities", COMMODITIES, '.', "PctChg-Commodities")
