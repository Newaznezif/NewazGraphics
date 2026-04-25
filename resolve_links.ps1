$links = @(
  'https://canva.link/w7yxz8rmmzjk6lk',
  'https://canva.link/r2akdlsl55qu3ao',
  'https://canva.link/5yljzc6fhcthmte',
  'https://canva.link/ywfpkzod67q3xuw',
  'https://canva.link/u3i319oi6m1eh9f',
  'https://canva.link/iv95uo0gihkvm4o',
  'https://canva.link/860ennxfgvn8jff',
  'https://canva.link/2qwj3q6sidob05k',
  'https://canva.link/fuhy7px7d9wc7nb'
)
foreach ($link in $links) {
  try {
    $request = [System.Net.WebRequest]::Create($link)
    $request.AllowAutoRedirect = $true
    $request.UserAgent = "Mozilla/5.0"
    $response = $request.GetResponse()
    $finalUrl = $response.ResponseUri
    $response.Close()
    Write-Host "$link => $finalUrl"
  } catch {
    Write-Host "Error for ${link}: $_"
  }
}
