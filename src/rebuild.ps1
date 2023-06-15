Set-Location -Path "C:\Users\Administrator\radar-index"
git pull
Set-Location -Path "C:\Users\Administrator\radar-index\src"
py .\1_fetch_cdb.py
py .\2_gen_news.py
Set-Location -Path "C:\Users\Administrator\radar-index"
npm run build

$source = "C:\Users\Administrator\radar-index\public"
$destination = "C:\Users\Administrator\Desktop\Radar\nginx-1.24.0\html\news"

Get-ChildItem -Path $source | ForEach-Object {
    $sourcePath = Join-Path -Path $source -ChildPath $_.Name
    $destPath = Join-Path -Path $destination -ChildPath $_.Name
    if (Test-Path -Path $destPath) {
        Remove-Item -Path $destPath -Force -Recurse
    }
    Copy-Item -Path $sourcePath -Destination $destPath -Recurse -Force
}
