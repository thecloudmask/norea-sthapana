<template>
  <div class="space-y-8">
    <!-- Summary Cards -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      
      <!-- Total Income -->
      <Card class="rounded-3xl border-none ring-1 ring-border shadow-sm bg-card overflow-hidden group transition-all hover:shadow-md">
        <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-3 bg-muted/30">
          <CardTitle class="text-[10px] font-normal text-muted-foreground/60 uppercase tracking-wider font-khmer">
            {{ $t('admin.ceremony_finance.total_income') }}
          </CardTitle>
          <div class="h-10 w-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500 border border-emerald-500/20 group-hover:bg-emerald-500/20 transition-colors">
            <TrendingUpIcon class="h-5 w-5" />
          </div>
        </CardHeader>
        <CardContent class="pt-6">
          <div class="space-y-1">
            <div class="text-3xl font-normal text-foreground tabular-nums tracking-tight">
              {{ $t('common.currency_usd') }}{{ summary.totalIncome.usd.toLocaleString(undefined, { minimumFractionDigits: 2 }) }}
            </div>
            <div v-if="summary.totalIncome.khr > 0" class="text-lg font-medium text-muted-foreground/60 tabular-nums">
              {{ $t('common.currency_khr') }}{{ summary.totalIncome.khr.toLocaleString() }}
            </div>
          </div>
          <div class="mt-4 flex items-center gap-1.5 text-xs font-normal text-emerald-600/70 bg-emerald-500/5 px-2.5 py-1 rounded-lg w-fit border border-emerald-500/10">
            <CoinsIcon class="size-3.5" />
            <span>{{ summary.incomeCount }} {{ $t('admin.ceremony_finance.income_count') }}</span>
          </div>
        </CardContent>
      </Card>

      <!-- Total Expense -->
      <Card class="rounded-3xl border-none ring-1 ring-border shadow-sm bg-card overflow-hidden group transition-all hover:shadow-md">
        <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-3 bg-muted/30">
          <CardTitle class="text-[10px] font-normal text-muted-foreground/60 uppercase tracking-wider font-khmer">
            {{ $t('admin.ceremony_finance.total_expense') }}
          </CardTitle>
          <div class="h-10 w-10 rounded-xl bg-rose-500/10 flex items-center justify-center text-rose-500 border border-rose-500/20 group-hover:bg-rose-500/20 transition-colors">
            <TrendingDownIcon class="h-5 w-5" />
          </div>
        </CardHeader>
        <CardContent class="pt-6">
          <div class="space-y-1">
            <div class="text-3xl font-normal text-foreground tabular-nums tracking-tight">
              {{ $t('common.currency_usd') }}{{ summary.totalExpense.usd.toLocaleString(undefined, { minimumFractionDigits: 2 }) }}
            </div>
            <div v-if="summary.totalExpense.khr > 0" class="text-lg font-medium text-muted-foreground/60 tabular-nums">
              {{ $t('common.currency_khr') }}{{ summary.totalExpense.khr.toLocaleString() }}
            </div>
          </div>
           <div class="mt-4 flex items-center gap-1.5 text-xs font-normal text-rose-600/70 bg-rose-500/5 px-2.5 py-1 rounded-lg w-fit border border-rose-500/10">
            <ReceiptIcon class="size-3.5" />
            <span>{{ summary.expenseCount }} {{ $t('admin.ceremony_finance.expense_count') }}</span>
          </div>
        </CardContent>
      </Card>

      <!-- Balance -->
      <Card class="rounded-3xl border-none ring-1 ring-border shadow-sm bg-card overflow-hidden group transition-all hover:shadow-md">
        <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-3 bg-muted/30">
          <CardTitle class="text-[10px] font-normal text-muted-foreground/60 uppercase tracking-wider font-khmer">
            {{ $t('admin.ceremony_finance.balance') }}
          </CardTitle>
          <div class="h-10 w-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500 border border-blue-500/20 group-hover:bg-blue-500/20 transition-colors">
            <WalletIcon class="h-5 w-5" />
          </div>
        </CardHeader>
        <CardContent class="pt-6">
          <div class="space-y-1">
            <div class="text-3xl font-normal tabular-nums tracking-tight text-primary" :class="{'text-rose-500': summary.balance.usd < 0}">
              {{ $t('common.currency_usd') }}{{ summary.balance.usd.toLocaleString(undefined, { minimumFractionDigits: 2 }) }}
            </div>
            <div v-if="summary.balance.khr !== 0" class="text-lg font-medium text-muted-foreground/60 tabular-nums" :class="{'text-rose-500/60': summary.balance.khr < 0}">
              {{ $t('common.currency_khr') }}{{ summary.balance.khr.toLocaleString() }}
            </div>
          </div>
           <div class="mt-4 flex items-center gap-1.5 text-xs font-normal text-blue-600/70 bg-blue-500/5 px-2.5 py-1 rounded-lg w-fit border border-blue-500/10">
            <ActivityIcon class="size-3.5" />
            <span>{{ $t('common.status_active') }}</span>
          </div>
        </CardContent>
      </Card>
    </div>

    <!-- Main Content -->
     <Tabs default-value="income" class="space-y-8">
       <!-- Tab List & Search -->
      <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <TabsList class="bg-muted/40 p-1.5 rounded-[28px] inline-flex h-20 border border-border/50">
          <TabsTrigger 
            value="income" 
             class="rounded-[20px] px-8 h-full data-[state=active]:bg-background data-[state=active]:text-emerald-600 data-[state=active]:shadow-[0_4px_20px_-4px_rgba(0,0,0,0.1)] font-normal transition-all flex flex-col items-center justify-center gap-1.5 group"
          >
             <CoinsIcon class="size-5 transition-transform group-active:scale-95" />
             <span class="font-khmer text-xs leading-none">{{ $t('admin.ceremony_finance.income') }}</span>
          </TabsTrigger>
          <TabsTrigger 
            value="expense" 
             class="rounded-[20px] px-8 h-full data-[state=active]:bg-background data-[state=active]:text-rose-600 data-[state=active]:shadow-[0_4px_20px_-4px_rgba(0,0,0,0.1)] font-normal transition-all flex flex-col items-center justify-center gap-1.5 group"
          >
             <ReceiptIcon class="size-5 transition-transform group-active:scale-95" />
             <span class="font-khmer text-xs leading-none">{{ $t('admin.ceremony_finance.expense') }}</span>
          </TabsTrigger>
        </TabsList>

        <div class="flex items-center gap-3 w-full sm:w-auto">
          <Button variant="outline" @click="handleExport" class="rounded-xl h-11 border-border bg-card shadow-sm font-medium hover:bg-muted">
            <DownloadIcon class="size-4 mr-2" />
            {{ $t('admin.reports.export_csv') }}
          </Button>
          <div class="relative flex-1 sm:flex-none group">
            <SearchIcon class="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <Input 
              v-model="searchTerm"
              :placeholder="$t('admin.ceremony_finance.search_placeholder')"
               class="pl-10 h-11 w-full sm:w-[300px] rounded-xl border-border bg-card shadow-sm hover:border-primary/50 focus:border-primary transition-all"
            />
          </div>
        </div>
      </div>

      <!-- Income Content -->
      <TabsContent value="income" class="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500 focus-visible:outline-none">
        <div class="flex justify-between items-center mb-2">
            <div>
               <h3 class="text-xl font-normal text-foreground font-khmer">{{ $t('admin.ceremony_finance.income_list') }}</h3>
               <p class="text-sm text-muted-foreground">{{ $t('admin.ceremony_finance.income_list_desc') }}</p>
            </div>
            <Button @click="openAddIncomeModal" size="sm" class="rounded-xl h-10 px-5 font-normal shadow-lg shadow-emerald-500/20 bg-emerald-600 hover:bg-emerald-700 text-white transition-all hover:-translate-y-0.5">
                <PlusIcon class="size-4 mr-2" />
                {{ $t('admin.ceremony_finance.add_income') }}
             </Button>
        </div>

        <div class="rounded-3xl border-none ring-1 ring-border bg-card shadow-sm overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow class="bg-muted/30 hover:bg-muted/30 border-b border-border">
                <TableHead class="w-[120px] font-normal text-muted-foreground uppercase text-[11px] tracking-wider">{{ $t('admin.ceremony_finance.receipt_number') }}</TableHead>
                <TableHead class="font-normal text-muted-foreground uppercase text-[11px] tracking-wider">{{ $t('admin.ceremony_finance.donor_name') }}</TableHead>
                <TableHead class="hidden md:table-cell font-normal text-muted-foreground uppercase text-[11px] tracking-wider">{{ $t('admin.ceremony_finance.description') }}</TableHead>
                <TableHead class="font-normal text-muted-foreground uppercase text-[11px] tracking-wider">{{ $t('admin.ceremony_finance.payment_method') }}</TableHead>
                <TableHead class="text-right font-normal text-muted-foreground uppercase text-[11px] tracking-wider">{{ $t('admin.ceremony_finance.amount') }}</TableHead>
                <TableHead class="w-[100px] text-right"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow v-for="income in filteredIncomes" :key="income.id" class="group hover:bg-muted/20 border-border/40 transition-colors">
                <TableCell class="font-mono text-xs font-normal text-muted-foreground/70">
                   {{ income.receiptNumber }}
                </TableCell>
                <TableCell>
                  <div class="flex items-center gap-3">
                     <div class="h-8 w-8 rounded-full bg-emerald-500/10 text-emerald-600 flex items-center justify-center text-xs font-normal uppercase border border-emerald-500/20">
                        {{ income.donorName.charAt(0) }}
                     </div>
                     <div>
                        <div class="font-normal text-sm font-khmer text-foreground">{{ income.donorName }}</div>
                        <div class="text-[10px] text-muted-foreground uppercase tracking-wider font-normal">{{ formatDate(income.createdAt) }}</div>
                     </div>
                  </div>
                </TableCell>
                <TableCell class="hidden md:table-cell text-sm text-muted-foreground max-w-[200px] truncate">
                   {{ income.description || '-' }}
                </TableCell>
                <TableCell>
                   <Badge variant="outline" class="font-normal text-[10px] bg-background border-border uppercase tracking-wider text-muted-foreground/80 rounded-md px-2 py-0.5">
                      {{ $t(`admin.ceremony_finance.payment_methods.${income.paymentMethod}`) }}
                   </Badge>
                </TableCell>
                <TableCell class="text-right">
                   <div class="font-normal tabular-nums text-sm" :class="income.currency === 'USD' ? 'text-primary' : 'text-blue-600'">
                      {{ income.currency === 'USD' ? $t('common.currency_usd') : $t('common.currency_khr') }}{{ income.amount.toLocaleString() }}
                   </div>
                </TableCell>
                <TableCell class="text-right">
                   <div class="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button variant="ghost" size="icon" class="h-8 w-8 rounded-lg text-muted-foreground hover:text-emerald-600 hover:bg-emerald-50 border border-transparent hover:border-emerald-100 shadow-sm" @click="selectedIncome = income">
                        <EyeIcon class="size-3.5" />
                      </Button>
                      <Button variant="ghost" size="icon" class="h-8 w-8 rounded-lg text-muted-foreground hover:text-primary hover:bg-primary/5 border border-transparent hover:border-primary/20 shadow-sm" @click="editIncome(income)">
                        <PencilIcon class="size-3.5" />
                      </Button>
                      <Button variant="ghost" size="icon" class="h-8 w-8 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/5 border border-transparent hover:border-destructive/20 shadow-sm" @click="confirmDelete('income', income)">
                        <Trash2Icon class="size-3.5" />
                      </Button>
                   </div>
                </TableCell>
              </TableRow>
              <TableRow v-if="filteredIncomes.length === 0">
                 <TableCell colspan="6" class="h-40">
                    <div class="flex flex-col items-center justify-center text-muted-foreground/30 gap-4">
                       <FolderOpenIcon class="size-10" />
                       <span class="text-xs font-normal uppercase tracking-widest">{{ $t('admin.ceremony_finance.no_income') }}</span>
                    </div>
                 </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </TabsContent>

      <!-- Expense Content -->
      <TabsContent value="expense" class="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500 focus-visible:outline-none">
         <div class="flex justify-between items-center mb-2">
            <div>
               <h3 class="text-xl font-normal text-foreground font-khmer">{{ $t('admin.ceremony_finance.expense_list') }}</h3>
               <p class="text-sm text-muted-foreground">{{ $t('admin.ceremony_finance.expense_list_desc') }}</p>
            </div>
            <Button @click="openAddExpenseModal" size="sm" class="rounded-xl h-10 px-5 font-normal shadow-lg shadow-rose-500/20 bg-rose-600 hover:bg-rose-700 text-white transition-all hover:-translate-y-0.5">
                <PlusIcon class="size-4 mr-2" />
                {{ $t('admin.ceremony_finance.add_expense') }}
             </Button>
        </div>

        <div class="rounded-3xl border-none ring-1 ring-border bg-card shadow-sm overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow class="bg-muted/30 hover:bg-muted/30 border-b border-border">
                <TableHead class="w-[120px] font-normal text-muted-foreground uppercase text-[11px] tracking-wider">{{ $t('admin.ceremony_finance.expense_number') }}</TableHead>
                <TableHead class="font-normal text-muted-foreground uppercase text-[11px] tracking-wider">{{ $t('admin.ceremony_finance.item_name') }}</TableHead>
                <TableHead class="hidden md:table-cell font-normal text-muted-foreground uppercase text-[11px] tracking-wider">{{ $t('admin.ceremony_finance.category') }}</TableHead>
                <TableHead class="font-normal text-muted-foreground uppercase text-[11px] tracking-wider">{{ $t('admin.ceremony_finance.vendor') }}</TableHead>
                <TableHead class="text-right font-normal text-muted-foreground uppercase text-[11px] tracking-wider">{{ $t('admin.ceremony_finance.amount') }}</TableHead>
                <TableHead class="w-[100px] text-right"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow v-for="expense in filteredExpenses" :key="expense.id" class="group hover:bg-muted/20 border-border/40 transition-colors">
                 <TableCell class="font-mono text-xs font-normal text-muted-foreground/70">
                   {{ expense.expenseNumber }}
                </TableCell>
                <TableCell>
                   <div class="flex items-center gap-3">
                     <div class="h-8 w-8 rounded-full bg-rose-500/10 text-rose-600 flex items-center justify-center text-xs font-normal uppercase border border-rose-500/20">
                        {{ expense.itemName.charAt(0) }}
                     </div>
                     <div>
                        <div class="font-normal text-sm font-khmer text-foreground">{{ expense.itemName }}</div>
                        <div class="text-[10px] text-muted-foreground uppercase tracking-wider font-normal">{{ formatDate(expense.createdAt) }}</div>
                     </div>
                  </div>
                </TableCell>
                <TableCell class="hidden md:table-cell">
                   <Badge variant="outline" class="font-normal text-[10px] bg-rose-50/50 border-rose-200 text-rose-700 rounded-md px-2 py-0.5 uppercase tracking-wider">
                      {{ $t(`admin.ceremony_finance.expense_categories.${expense.category}`) }}
                   </Badge>
                </TableCell>
                 <TableCell class="text-sm text-muted-foreground">
                   {{ expense.vendor || '-' }}
                </TableCell>
                <TableCell class="text-right">
                   <div class="font-normal tabular-nums text-sm text-destructive">
                      -{{ expense.currency === 'USD' ? $t('common.currency_usd') : $t('common.currency_khr') }}{{ expense.amount.toLocaleString() }}
                   </div>
                </TableCell>
                <TableCell class="text-right">
                   <div class="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button variant="ghost" size="icon" class="h-8 w-8 rounded-lg text-muted-foreground hover:text-rose-600 hover:bg-rose-50 border border-transparent hover:border-rose-100 shadow-sm" @click="selectedExpense = expense">
                        <EyeIcon class="size-3.5" />
                      </Button>
                      <Button variant="ghost" size="icon" class="h-8 w-8 rounded-lg text-muted-foreground hover:text-primary hover:bg-primary/5 border border-transparent hover:border-primary/20 shadow-sm" @click="editExpense(expense)">
                        <PencilIcon class="size-3.5" />
                      </Button>
                      <Button variant="ghost" size="icon" class="h-8 w-8 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/5 border border-transparent hover:border-destructive/20 shadow-sm" @click="confirmDelete('expense', expense)">
                        <Trash2Icon class="size-3.5" />
                      </Button>
                   </div>
                </TableCell>
              </TableRow>
               <TableRow v-if="filteredExpenses.length === 0">
                 <TableCell colspan="6" class="h-40">
                    <div class="flex flex-col items-center justify-center text-muted-foreground/30 gap-4">
                       <FolderOpenIcon class="size-10" />
                       <span class="text-xs font-normal uppercase tracking-widest">{{ $t('admin.ceremony_finance.no_expense') }}</span>
                    </div>
                 </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </TabsContent>
    </Tabs>

    <!-- Delete Confirmation Dialog -->
    <Dialog :open="!!itemToDelete" @update:open="(val) => !val && (itemToDelete = null)">
      <DialogContent class="rounded-2xl border-none shadow-xl">
        <DialogHeader>
          <DialogTitle>{{ $t('admin.confirmations.delete_title', { type: deleteType === 'income' ? $t('admin.ceremony_finance.income') : $t('admin.ceremony_finance.expense') }) }}</DialogTitle>
          <DialogDescription>
            {{ $t('admin.confirmations.delete_desc', { name: deleteType === 'income' ? (itemToDelete as any)?.receiptNumber : (itemToDelete as any)?.expenseNumber }) }}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" class="rounded-xl" @click="itemToDelete = null">{{ $t('admin.forms.cancel') }}</Button>
          <Button variant="destructive" class="rounded-xl bg-rose-600 hover:bg-rose-700" @click="handleDelete" :disabled="deleting">
            {{ deleting ? $t('common.processing') : $t('admin.confirmations.confirm_delete') }}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
    
    <!-- View Income Details Modal -->
    <Dialog :open="!!selectedIncome" @update:open="(val) => !val && (selectedIncome = null)">
      <DialogContent class="max-w-2xl rounded-[32px] border-none shadow-2xl p-0 overflow-hidden bg-card max-h-[90vh] flex flex-col">
        <!-- Fixed Header -->
        <div class="bg-emerald-600 p-8 text-white relative h-32 flex items-end flex-shrink-0">
           <div class="absolute top-6 right-6 flex items-center gap-2">
              <Badge class="bg-white/20 text-white border-none backdrop-blur-md uppercase tracking-widest text-[10px]">{{ selectedIncome?.receiptNumber }}</Badge>
           </div>
           <div>
              <h2 class="text-2xl font-normal font-khmer">{{ $t('admin.ceremony_finance.view_income') }}</h2>
              <p class="text-white/70 text-sm font-normal">{{ formatDate(selectedIncome?.createdAt) }}</p>
           </div>
        </div>

        <!-- Scrollable Body -->
        <div class="p-8 space-y-8 overflow-y-auto flex-1 custom-scrollbar">
           <div class="grid grid-cols-2 gap-8">
              <div class="space-y-1.5">
                 <Label class="text-[10px] uppercase tracking-widest text-muted-foreground font-normal">{{ $t('admin.ceremony_finance.donor_name') }}</Label>
                 <div class="text-lg font-normal font-khmer text-foreground">{{ selectedIncome?.donorName }}</div>
              </div>
              <div class="space-y-1.5">
                 <Label class="text-[10px] uppercase tracking-widest text-muted-foreground font-normal">{{ $t('admin.ceremony_finance.amount') }}</Label>
                 <div class="text-2xl font-normal text-emerald-600 tabular-nums">
                    {{ selectedIncome?.currency === 'USD' ? '$' : '៛' }}{{ selectedIncome?.amount.toLocaleString() }}
                 </div>
              </div>
              <div class="space-y-1.5">
                 <Label class="text-[10px] uppercase tracking-widest text-muted-foreground font-normal">{{ $t('admin.ceremony_finance.payment_method') }}</Label>
                 <Badge variant="secondary" class="rounded-lg px-3 py-1 bg-emerald-50 text-emerald-700 border-none font-normal uppercase text-[10px] tracking-wider">{{ $t(`admin.ceremony_finance.payment_methods.${selectedIncome?.paymentMethod}`) }}</Badge>
              </div>
              <div v-if="selectedIncome?.donorPhone" class="space-y-1.5">
                 <Label class="text-[10px] uppercase tracking-widest text-muted-foreground font-normal">{{ $t('admin.ceremony_finance.donor_phone') }}</Label>
                 <div class="text-base font-normal text-foreground">{{ selectedIncome?.donorPhone }}</div>
              </div>
           </div>

           <div v-if="selectedIncome?.description" class="space-y-2 border-t border-border pt-6">
              <Label class="text-[10px] uppercase tracking-widest text-muted-foreground font-normal">{{ $t('admin.ceremony_finance.description') }}</Label>
              <p class="text-sm text-muted-foreground leading-relaxed">{{ selectedIncome?.description }}</p>
           </div>

           <div v-if="selectedIncome?.receiptUrl" class="space-y-3 border-t border-border pt-6">
              <Label class="text-[10px] uppercase tracking-widest text-muted-foreground font-normal">{{ $t('admin.ceremony_finance.receipt') }}</Label>
              <div class="rounded-2xl overflow-hidden border border-border bg-muted/30 p-2">
                 <img :src="selectedIncome?.receiptUrl" class="w-full h-auto max-h-[220px] object-contain rounded-xl" />
              </div>
           </div>
        </div>

        <!-- Fixed Footer -->
        <DialogFooter class="p-6 bg-muted/20 border-t border-border gap-3 flex-shrink-0">
           <Button variant="outline" class="flex-1 rounded-xl h-11 font-normal border-border" @click="selectedIncome = null">{{ $t('common.close') }}</Button>
           <Button class="flex-1 rounded-xl h-11 font-normal bg-primary text-white" @click="editIncome(selectedIncome!)">{{ $t('admin.forms.edit') }}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>

    <!-- View Expense Details Modal -->
    <Dialog :open="!!selectedExpense" @update:open="(val) => !val && (selectedExpense = null)">
      <DialogContent class="max-w-2xl rounded-[32px] border-none shadow-2xl p-0 overflow-hidden bg-card max-h-[90vh] flex flex-col">
        <!-- Fixed Header -->
        <div class="bg-rose-600 p-8 text-white relative h-32 flex items-end flex-shrink-0">
           <div class="absolute top-6 right-6 flex items-center gap-2">
              <Badge class="bg-white/20 text-white border-none backdrop-blur-md uppercase tracking-widest text-[10px]">{{ selectedExpense?.expenseNumber }}</Badge>
           </div>
           <div>
              <h2 class="text-2xl font-normal font-khmer">{{ $t('admin.ceremony_finance.view_expense') }}</h2>
              <p class="text-white/70 text-sm font-normal">{{ formatDate(selectedExpense?.createdAt) }}</p>
           </div>
        </div>

        <!-- Scrollable Body -->
        <div class="p-8 space-y-8 overflow-y-auto flex-1 custom-scrollbar">
           <div class="grid grid-cols-2 gap-8">
              <div class="space-y-1.5">
                 <Label class="text-[10px] uppercase tracking-widest text-muted-foreground font-normal">{{ $t('admin.ceremony_finance.item_name') }}</Label>
                 <div class="text-lg font-normal font-khmer text-foreground">{{ selectedExpense?.itemName }}</div>
              </div>
              <div class="space-y-1.5">
                 <Label class="text-[10px] uppercase tracking-widest text-muted-foreground font-normal">{{ $t('admin.ceremony_finance.amount') }}</Label>
                 <div class="text-2xl font-normal text-rose-600 tabular-nums">
                    {{ selectedExpense?.currency === 'USD' ? '$' : '៛' }}{{ selectedExpense?.amount.toLocaleString() }}
                 </div>
              </div>
              <div class="space-y-1.5">
                 <Label class="text-[10px] uppercase tracking-widest text-muted-foreground font-normal">{{ $t('admin.ceremony_finance.category') }}</Label>
                 <Badge variant="secondary" class="rounded-lg px-3 py-1 bg-rose-50 text-rose-700 border-none font-normal uppercase text-[10px] tracking-wider">{{ $t(`admin.ceremony_finance.expense_categories.${selectedExpense?.category}`) }}</Badge>
              </div>
              <div v-if="selectedExpense?.vendor" class="space-y-1.5">
                 <Label class="text-[10px] uppercase tracking-widest text-muted-foreground font-normal">{{ $t('admin.ceremony_finance.vendor') }}</Label>
                 <div class="text-base font-normal text-foreground">{{ selectedExpense?.vendor }}</div>
              </div>
           </div>

           <div class="grid grid-cols-3 gap-8 border-t border-border pt-6">
              <div v-if="selectedExpense?.quantity" class="space-y-1.5">
                 <Label class="text-[10px] uppercase tracking-widest text-muted-foreground font-normal">{{ $t('admin.ceremony_finance.quantity') }}</Label>
                 <div class="text-base font-normal">{{ selectedExpense?.quantity }}</div>
              </div>
              <div v-if="selectedExpense?.unitPrice" class="space-y-1.5">
                 <Label class="text-[10px] uppercase tracking-widest text-muted-foreground font-normal">{{ $t('admin.ceremony_finance.unit_price') }}</Label>
                 <div class="text-base font-normal">{{ selectedExpense?.currency === 'USD' ? '$' : '៛' }}{{ selectedExpense?.unitPrice.toLocaleString() }}</div>
              </div>
              <div v-if="selectedExpense?.paidBy" class="space-y-1.5">
                 <Label class="text-[10px] uppercase tracking-widest text-muted-foreground font-normal">{{ $t('admin.ceremony_finance.paid_by') }}</Label>
                 <div class="text-base font-normal font-khmer">{{ selectedExpense?.paidBy }}</div>
              </div>
           </div>

           <div v-if="selectedExpense?.description" class="space-y-2 border-t border-border pt-6">
              <Label class="text-[10px] uppercase tracking-widest text-muted-foreground font-normal">{{ $t('admin.ceremony_finance.description') }}</Label>
              <p class="text-sm text-muted-foreground leading-relaxed">{{ selectedExpense?.description }}</p>
           </div>

           <div v-if="selectedExpense?.receiptUrl" class="space-y-3 border-t border-border pt-6">
              <Label class="text-[10px] uppercase tracking-widest text-muted-foreground font-normal">{{ $t('admin.ceremony_finance.receipt') }}</Label>
              <div class="rounded-2xl overflow-hidden border border-border bg-muted/30 p-2">
                 <img :src="selectedExpense?.receiptUrl" class="w-full h-auto max-h-[220px] object-contain rounded-xl" />
              </div>
           </div>
        </div>

        <!-- Fixed Footer -->
        <DialogFooter class="p-6 bg-muted/20 border-t border-border gap-3 flex-shrink-0">
           <Button variant="outline" class="flex-1 rounded-xl h-11 font-normal border-border" @click="selectedExpense = null">{{ $t('common.close') }}</Button>
           <Button class="flex-1 rounded-xl h-11 font-normal bg-primary text-white" @click="editExpense(selectedExpense!)">{{ $t('admin.forms.edit') }}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { format } from 'date-fns'
import {
  TrendingUpIcon,
  TrendingDownIcon,
  WalletIcon,
  CoinsIcon,
  ReceiptIcon,
  PlusIcon,
  SearchIcon,
  PencilIcon,
  Trash2Icon,
  ActivityIcon,
  FolderOpenIcon,
  EyeIcon,
  DownloadIcon
} from 'lucide-vue-next'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { useCeremonyFinance } from '~/composables/useCeremonyFinance'
import { formatKhmerDate } from '~/utils/date'
import type { CeremonyIncome, CeremonyExpense } from '~/types/ceremonyFinance'

const props = defineProps<{
  ceremonyId: string
}>()

const { t } = useI18n()
const emit = defineEmits(['add-income', 'add-expense', 'edit-income', 'edit-expense'])

const {
  incomes,
  expenses,
  summary,
  fetchIncomes,
  fetchExpenses,
  searchIncomes,
  deleteIncome,
  deleteExpense
} = useCeremonyFinance()

const searchTerm = ref('')
const itemToDelete = ref<any>(null)
const deleteType = ref<'income' | 'expense' | null>(null)
const selectedIncome = ref<CeremonyIncome | null>(null)
const selectedExpense = ref<CeremonyExpense | null>(null)
const deleting = ref(false)

let unsubIncomes: (() => void) | null = null
let unsubExpenses: (() => void) | null = null

onMounted(() => {
  if (props.ceremonyId) {
    unsubIncomes = fetchIncomes(props.ceremonyId)
    unsubExpenses = fetchExpenses(props.ceremonyId)
  }
})

onUnmounted(() => {
  if (unsubIncomes) unsubIncomes()
  if (unsubExpenses) unsubExpenses()
})

const filteredIncomes = computed(() => {
  if (!searchTerm.value.trim()) return incomes.value
  return searchIncomes(props.ceremonyId, searchTerm.value)
})

const filteredExpenses = computed(() => {
    if (!searchTerm.value.trim()) return expenses.value
    const term = searchTerm.value.toLowerCase()
    return expenses.value.filter(e => 
        e.itemName.toLowerCase().includes(term) || 
        (e.description && e.description.toLowerCase().includes(term)) ||
        (e.vendor && e.vendor.toLowerCase().includes(term))
    )
})

const formatDate = (date: any) => {
  if (!date) return ''
  const d = date?.toDate ? date.toDate() : new Date(date)
  const lang = t('common.locale_key')
  try {
     if (lang === 'km') {
       return formatKhmerDate(d, 'dd/MM/yyyy HH:mm')
     }
     return format(d, 'dd/MM/yyyy HH:mm')
  } catch (e) {
     return ''
  }
}

const openAddIncomeModal = () => {
  emit('add-income')
}

const openAddExpenseModal = () => {
  emit('add-expense')
}

const editIncome = (income: CeremonyIncome) => {
  emit('edit-income', income)
}

const editExpense = (expense: CeremonyExpense) => {
  emit('edit-expense', expense)
}

const confirmDelete = (type: 'income' | 'expense', item: any) => {
  deleteType.value = type
  itemToDelete.value = item
}

const handleDelete = async () => {
  if (!itemToDelete.value || !deleteType.value) return
  
  deleting.value = true
  try {
    if (deleteType.value === 'income') {
      await deleteIncome(itemToDelete.value.id)
    } else {
      await deleteExpense(itemToDelete.value.id)
    }
    itemToDelete.value = null
    deleteType.value = null
  } catch (err) {
    console.error('Failed to delete', err)
  } finally {
    deleting.value = false
  }
}

const handleExport = () => {
    // Collect all data
    const data: any[] = []
    
    // Incomes
    incomes.value.forEach(i => {
        data.push({
            type: t('admin.ceremony_finance.income'),
            number: i.receiptNumber,
            name: i.donorName,
            category: t(`admin.ceremony_finance.payment_methods.${i.paymentMethod}`),
            amount: i.amount,
            currency: i.currency,
            date: formatDate(i.createdAt),
            description: i.description || ''
        })
    })
    
    // Expenses
    expenses.value.forEach(e => {
        data.push({
            type: t('admin.ceremony_finance.expense'),
            number: e.expenseNumber,
            name: e.itemName,
            category: t(`admin.ceremony_finance.expense_categories.${e.category}`),
            amount: -e.amount,
            currency: e.currency,
            date: formatDate(e.createdAt),
            description: e.description || ''
        })
    })
    
    if (data.length === 0) return
    
    // Create CSV
    const headers = [
        t('admin.table.type'),
        t('admin.ceremony_finance.receipt_number'),
        t('admin.ceremony_finance.donor_name'),
        t('admin.ceremony_finance.category'),
        t('admin.ceremony_finance.amount'),
        t('admin.ceremony_finance.currency'),
        t('admin.table.date'),
        t('admin.ceremony_finance.description')
    ]
    
    const csvContent = [
        headers.join(','),
        ...data.map(row => [
            `"${row.type}"`,
            `"${row.number}"`,
            `"${row.name}"`,
            `"${row.category}"`,
            row.amount,
            `"${row.currency}"`,
            `"${row.date}"`,
            `"${row.description.replace(/"/g, '""')}"`
        ].join(','))
    ].join('\n')
    
    const blob = new Blob([`\ufeff${csvContent}`], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', `ceremony_finance_${props.ceremonyId}_${format(new Date(), 'yyyyMMdd')}.csv`)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
}
</script>
