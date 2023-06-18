Set-Location -Path "D:\AMT Research\Radar\radar-index"
git pull
Set-Location -Path "D:\AMT Research\Radar\radar-index\src"
py .\1_fetch_cdb.py
py .\2_gen_news.py
Set-Location -Path "D:\AMT Research\Radar\radar-index"
npm run build
mkdir "D:\AMT Research\nginx\html\news"
$source = "D:\AMT Research\Radar\radar-index\public"
$destination = "D:\AMT Research\nginx\html\news"

Get-ChildItem -Path $source | ForEach-Object {
    $sourcePath = Join-Path -Path $source -ChildPath $_.Name
    $destPath = Join-Path -Path $destination -ChildPath $_.Name
    if (Test-Path -Path $destPath) {
        Remove-Item -Path $destPath -Force -Recurse
    }
    Copy-Item -Path $sourcePath -Destination $destPath -Recurse -Force
}
