$file = 'd:\workspace\projects\narea_sthapana\src\pages\index.vue'
$lines = Get-Content $file -Encoding UTF8

$inReplace = $false
$skipCount = 0
$newLines = @()

for ($i = 0; $i -lt $lines.Count; $i++) {
    if ($skipCount -gt 0) {
        $skipCount--
        continue
    }
    
    $line = $lines[$i]
    
    # Check if this is line 84 (index 83)
    if ($i -eq 83 -and $line -match 'absolute top-4 right-4 bg-card') {
        # Replace the next 3 lines
        $newLines += '                   <div class="absolute top-4 right-4">'
        $newLines += '                      <StatusBadge :status="project.status" />'
        $newLines += '                   </div>'
        $skipCount = 2  # Skip the next 2 lines (85, 86)
    }
    else {
        $newLines += $line
    }
}

$newLines | Set-Content $file -Encoding UTF8
Write-Host "Replacement complete"
