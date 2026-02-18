const fs = require('fs');
const file = 'd:/workspace/projects/narea_sthapana/src/pages/admin/reports.vue';
try {
  let content = fs.readFileSync(file, 'utf8');
  // Normalize line endings to LF for splitting just in case
  const lines = content.split(/\r?\n/);

  // L517 (Revenue Trend)
  if (lines[516].includes('Revenue Trend')) {
    lines[516] = '                <CardTitle class="text-xl font-medium text-foreground uppercase tracking-tight font-khmer">និន្នាការហិរញ្ញវត្ថុ (Revenue Trend)</CardTitle>';
  } else {
    console.log('Line 516 mismatch: ' + lines[516]);
  }

  // L518 (Based on current filters)
  if (lines[517].includes('Based on current filters')) {
    lines[517] = '                <CardDescription class="text-xs font-medium text-muted-foreground">ផ្អែកតាមការច្រោះទិន្នន័យ (Based on current filters)</CardDescription>';
  }

  // L541 (By payment method)
  if (lines[540].includes('By payment method')) {
    lines[540] = '                <CardDescription class="text-xs font-medium text-muted-foreground">តាមមធ្យោបាយបង់ប្រាក់ (By payment method)</CardDescription>';
  }

  // L563 (By category)
  if (lines[562].includes('By category')) {
    lines[562] = '                <CardDescription class="text-xs font-medium text-muted-foreground">តាមប្រភេទចំណាយ (By category)</CardDescription>';
  }
  
  // L586 (Detailed Transactions)
  if (lines[585].includes('Detailed Transactions')) {
    lines[585] = '                <CardTitle class="text-lg font-medium tracking-tight font-khmer">ប្រតិបត្តិការលម្អិត (Detailed Transactions)</CardTitle>';
  }

  fs.writeFileSync(file, lines.join('\n'));
  console.log('Successfully fixed reports.vue encoding.');
} catch (err) {
  console.error(err);
}
