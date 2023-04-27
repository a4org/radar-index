import csv
import os

def main():
    with open('commentaries.csv', newline='', encoding='utf-8') as csvfile:
        csv_reader = csv.reader(csvfile)
        rows = [row for row in csv_reader]
        tags = []
        titles = []

        current_tag = ''
        for row in rows:
            if len(row) > 0:
                if row[0]:
                    current_tag = row[0]
                tags.append(current_tag)
                titles.append(row[-1])
                
    with open(os.path.join('data', 'news.bib'), 'w', encoding='utf-8') as bibfile:
        for index, (tag, title) in enumerate(zip(tags, titles), start=1):
            bib_entry = f'@article{{row{index},\n  title={{{title}}},\n  tags={{{tag}}},\n}}\n\n'
            bibfile.write(bib_entry)

if __name__ == "__main__":
    main()
