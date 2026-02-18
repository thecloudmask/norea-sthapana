$file = "d:\workspace\projects\narea_sthapana\src\pages\admin\reports.vue"
$content = Get-Content $file

# Fix Revenue Trend (L517) - Index 516
$content[516] = '                <CardTitle class="text-xl font-medium text-foreground uppercase tracking-tight font-khmer">និន្នាការហិរញ្ញវត្ថុ (Revenue Trend)</CardTitle>'

# Fix Description (L518) - Index 517
$content[517] = '                <CardDescription class="text-xs font-medium text-muted-foreground">ផ្អែកតាមការច្រោះទិន្នន័យ (Based on current filters)</CardDescription>'

# Fix Income Description (L541) - Index 540
$content[540] = '                <CardDescription class="text-xs font-medium text-muted-foreground">តាមីធីបង់ប្រាក់ (By payment method)</CardDescription>'

# Fix Expense Description (L563) - Index 562
$content[562] = '                <CardDescription class="text-xs font-medium text-muted-foreground">តាមប្រភេទចំណាយ (By category)</CardDescription>'

# Fix Detailed Transactions (L586) - Index 585
$content[585] = '                <CardTitle class="text-lg font-medium tracking-tight font-khmer">ប្រតិបត្តិការលម្អិត (Detailed Transactions)</CardTitle>'

$content | Set-Content $file -Encoding UTF8
