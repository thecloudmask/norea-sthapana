<template>
  <div class="container py-10 space-y-10 transition-colors duration-300">
    <div v-if="authStore.loading" class="flex flex-col items-center justify-center py-20 gap-4">
      <div class="h-12 w-12 animate-spin rounded-full border-4 border-muted border-t-primary"></div>
      <p class="text-sm font-bold text-muted-foreground uppercase tracking-widest">{{ $t('common.processing') }}...</p>
    </div>

    <template v-else-if="authStore.isAuthenticated">
      <div v-if="loading" class="flex justify-center py-24">
         <div class="h-12 w-12 animate-spin rounded-full border-4 border-muted border-t-primary"></div>
      </div>

      <div v-else-if="project" class="space-y-8">
        <!-- Header Section -->
        <div class="space-y-6">
          <!-- Top Breadcrumb -->
          <RouterLink to="/admin/projects" class="text-[11px] font-medium text-muted-foreground flex items-center gap-2 hover:text-primary transition-colors">
            <ArrowLeftIcon class="h-3 w-3" /> 
            {{ $t('admin.back_to_projects') }}
          </RouterLink>

          <!-- Identity Row -->
          <div class="flex flex-col md:flex-row md:items-start justify-between gap-6">
            <div class="space-y-2 max-w-3xl">
              <div class="flex items-center gap-3">
                <Badge 
                  :class="{
                    'bg-emerald-500/10 text-emerald-600 border-emerald-500/20': project.status === 'active',
                    'bg-blue-500/10 text-blue-600 border-blue-500/20': project.status === 'completed',
                    'bg-rose-500/10 text-rose-600 border-rose-500/20': project.status === 'paused'
                  }"
                  class="px-2.5 py-0.5 text-[10px] font-medium border rounded-full"
                >
                  {{ $t('common.status_' + project.status) }}
                </Badge>
              </div>
              <h1 class="text-3xl md:text-4xl font-medium tracking-tight text-foreground leading-tight font-khmer">
                {{ project.title }}
              </h1>
              <p class="text-muted-foreground text-sm font-normal leading-relaxed font-khmer max-w-2xl">
                {{ project.description }}
              </p>
            </div>
            
            <div class="flex flex-wrap items-center gap-3">
              <Button 
                class="h-10 px-6 bg-primary hover:bg-orange-500 font-medium rounded-xl shadow-sm shadow-primary/20"
                @click="() => { editingItem = null; newDonation = { donorName: '', amount: 0, currency: 'USD', type: 'cash', itemName: '', itemQty: 1, paymentMethod: 'cash' }; showAddDonation = true }"
              >
                <PlusIcon class="mr-2 h-4 w-4" />
                {{ $t('admin.add_donation') }}
              </Button>
              <Button variant="outline" size="icon" class="size-10 rounded-xl border-border text-muted-foreground hover:text-primary hover:bg-primary/5 transition-all" @click="handleRecalculate" :disabled="recalculating">
                <RefreshCw class="size-4" :class="{ 'animate-spin': recalculating }" />
              </Button>
            </div>
          </div>
          
          <!-- Secondary Action Toolbar -->
          <div class="flex flex-wrap items-center justify-between gap-3 pt-2">
            <div class="flex items-center gap-2">
              <RouterLink :to="`/project/${project.id}`" target="_blank">
                <Button variant="ghost" size="sm" class="rounded-lg text-muted-foreground hover:text-primary transition-all font-medium text-xs">
                   <ExternalLinkIcon class="mr-2 h-4 w-4" />
                   {{ $t('admin.view_public_page') }}
                </Button>
              </RouterLink>
              <Button variant="ghost" size="sm" class="rounded-lg text-muted-foreground hover:text-primary transition-all font-medium text-xs" @click="handleExportReport">
                <DownloadIcon class="mr-2 h-4 w-4" />
                {{ $t('admin.full_report') }}
              </Button>
            </div>
            
            <Button variant="ghost" size="sm" class="rounded-lg text-muted-foreground hover:text-primary transition-all font-medium text-xs" @click="openEditProjectSettings">
              <SettingsIcon class="mr-2 h-4 w-4" />
              {{ $t('admin.project_settings') }}
            </Button>
          </div>
        </div>

        <!-- Main Content using Tabs -->
        <Tabs v-model="activeTab" class="w-full space-y-8">
          <div class="flex justify-start">
            <TabsList class="bg-muted p-1 rounded-2xl h-14 w-fit flex border border-border/50">
              <TabsTrigger value="overview" class="rounded-xl px-8 h-full data-[state=active]:bg-card data-[state=active]:text-primary data-[state=active]:shadow-sm font-medium transition-all text-sm font-khmer">{{ $t('admin.tabs.overview') }}</TabsTrigger>
              <TabsTrigger value="donations" class="rounded-xl px-8 h-full data-[state=active]:bg-card data-[state=active]:text-primary data-[state=active]:shadow-sm font-medium transition-all text-sm font-khmer">{{ $t('admin.tabs.donations') }}</TabsTrigger>
              <TabsTrigger value="expenses" class="rounded-xl px-8 h-full data-[state=active]:bg-card data-[state=active]:text-primary data-[state=active]:shadow-sm font-medium transition-all text-sm font-khmer">{{ $t('admin.tabs.expenses') }}</TabsTrigger>
              <TabsTrigger value="updates" class="rounded-xl px-8 h-full data-[state=active]:bg-card data-[state=active]:text-primary data-[state=active]:shadow-sm font-medium transition-all text-sm font-khmer">{{ $t('admin.tabs.updates') }}</TabsTrigger>
              <TabsTrigger value="analytics" class="rounded-xl px-8 h-full data-[state=active]:bg-card data-[state=active]:text-primary data-[state=active]:shadow-sm font-medium transition-all text-sm font-khmer">{{ $t('admin.tabs.analytics') }}</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="overview" class="space-y-6 pt-6">
            <!-- Summary Grid -->
            <div class="grid gap-6 md:grid-cols-4">
              <!-- Income Card -->
              <Card class="rounded-2xl border-none shadow-md bg-card ring-1 ring-border/10 overflow-hidden group">
                <div class="p-6 space-y-4">
                  <div class="flex items-center justify-between">
                    <span class="text-sm font-medium text-foreground/60 font-khmer">{{ $t('admin.revenue') }}</span>
                    <div class="size-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-600 ring-1 ring-emerald-500/20 shadow-sm">
                      <ArrowUpRightIcon class="size-5" />
                    </div>
                  </div>
                  <div class="space-y-1">
                    <div class="text-3xl font-bold text-foreground tracking-tight">{{ $t('common.currency_usd') }} {{ totalDonations.usd.toLocaleString(undefined, { minimumFractionDigits: 2 }) }}</div>
                    <div v-if="totalDonations.khr > 0" class="text-sm font-bold text-muted-foreground tabular-nums flex items-center gap-1">
                      <span class="opacity-40">{{ $t('common.currency_khr') }}</span>
                      {{ totalDonations.khr.toLocaleString() }}
                    </div>
                  </div>
                </div>
              </Card>
 
              <!-- Expense Card -->
              <Card class="rounded-2xl border-none shadow-md bg-card ring-1 ring-border/10 overflow-hidden group">
                <div class="p-6 space-y-4">
                  <div class="flex items-center justify-between">
                    <span class="text-sm font-medium text-foreground/60 font-khmer">{{ $t('admin.expenses') }}</span>
                    <div class="size-10 rounded-xl bg-rose-500/10 flex items-center justify-center text-rose-600 ring-1 ring-rose-500/20 shadow-sm">
                      <ArrowDownLeftIcon class="size-5" />
                    </div>
                  </div>
                  <div class="space-y-1">
                    <div class="text-3xl font-bold text-rose-600 tracking-tight">{{ $t('common.currency_usd') }} {{ totalExpenses.usd.toLocaleString(undefined, { minimumFractionDigits: 2 }) }}</div>
                    <div v-if="totalExpenses.khr > 0" class="text-sm font-bold text-muted-foreground tabular-nums flex items-center gap-1">
                      <span class="opacity-40">{{ $t('common.currency_khr') }}</span>
                      {{ totalExpenses.khr.toLocaleString() }}
                    </div>
                  </div>
                </div>
              </Card>
              
              <!-- Balance Card -->
              <Card class="rounded-2xl border-none shadow-md bg-card ring-1 ring-border/10 overflow-hidden group">
                <div class="p-6 space-y-4">
                  <div class="flex items-center justify-between">
                    <span class="text-sm font-medium text-foreground/60 font-khmer">{{ $t('admin.balance') }}</span>
                    <div class="size-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-600 ring-1 ring-blue-500/20 shadow-sm">
                      <WalletIcon class="size-5" />
                    </div>
                  </div>
                  <div class="space-y-1">
                    <div class="text-3xl font-bold tracking-tight" :class="totalBalance.usd >= 0 ? 'text-primary' : 'text-rose-600'">
                      {{ $t('common.currency_usd') }} {{ totalBalance.usd.toLocaleString(undefined, { minimumFractionDigits: 2 }) }}
                    </div>
                    <div v-if="totalBalance.khr !== 0" class="text-sm font-bold text-muted-foreground tabular-nums flex items-center gap-1">
                      <span class="opacity-40">{{ $t('common.currency_khr') }}</span>
                      {{ totalBalance.khr.toLocaleString() }}
                    </div>
                  </div>
                </div>
              </Card>
 
               <!-- Progress Card -->
              <Card class="rounded-2xl border-none shadow-md bg-card ring-1 ring-border/10 overflow-hidden group">
                <div class="p-6 space-y-4">
                  <div class="flex items-center justify-between">
                    <span class="text-sm font-medium text-foreground/60 font-khmer">{{ $t('admin.project_progress') }}</span>
                    <div class="size-10 rounded-xl bg-orange-500/10 flex items-center justify-center text-orange-600 ring-1 ring-orange-500/20 shadow-sm">
                      <BarChart3Icon class="size-5" />
                    </div>
                  </div>
                  <div class="space-y-3">
                    <div class="flex items-end justify-between">
                      <div class="text-3xl font-bold text-foreground tracking-tight">{{ projectProgress }}%</div>
                      <div class="text-xs font-bold text-foreground/60 uppercase tracking-widest font-khmer">Goal: ${{ (project.goalAmount || 0).toLocaleString() }}</div>
                    </div>
                    <div class="h-2 w-full bg-muted rounded-full overflow-hidden shadow-inner">
                      <div class="h-full bg-primary rounded-full transition-all duration-700 shadow-sm" :style="{ width: `${projectProgress}%` }"></div>
                    </div>
                  </div>
                </div>
              </Card>
            </div>

            <!-- Project QR & Info -->
            <div class="grid gap-6 md:grid-cols-3">
              <Card class="md:col-span-1 rounded-2xl border-none shadow-sm bg-card ring-1 ring-border/5 overflow-hidden">
                <CardHeader class="pb-4">
                  <CardTitle class="text-sm font-semibold text-foreground font-khmer">{{ $t('admin.qr_code') }}</CardTitle>
                  <CardDescription class="text-[10px] font-normal leading-tight">{{ $t('admin.qr_code_subtitle') }}</CardDescription>
                </CardHeader>
                <CardContent class="flex flex-col items-center pb-6">
                  <div class="aspect-square w-full max-w-[200px] bg-muted/30 rounded-2xl flex items-center justify-center border border-dashed border-border text-muted-foreground overflow-hidden group relative">
                    <img v-if="project.qrCodeUrl" :src="project.qrCodeUrl" class="w-full h-full object-contain p-2" />
                    <span v-else class="text-xs uppercase tracking-widest font-medium opacity-40">{{ $t('admin.no_image') }}</span>
                    
                    <div class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                       <Button variant="secondary" size="sm" class="h-8 rounded-lg font-medium text-[10px] uppercase tracking-wider" @click="triggerQRUpload">
                         {{ $t('admin.change_qr') }}
                       </Button>
                    </div>
                  </div>
                  <p class="mt-4 text-[10px] font-medium text-muted-foreground/60 uppercase tracking-widest italic">{{ $t('admin.scan_to_donate') }}</p>
                  <input type="file" id="qr-upload" class="hidden" accept="image/*" @change="handleUpdateQR" />
                </CardContent>
              </Card>
              
              <Card class="md:col-span-2 rounded-2xl shadow-sm bg-muted/20 ring-1 ring-border/5 overflow-hidden border-dashed border-2 border-border/50">
                <div class="h-full flex flex-col items-center justify-center p-8 text-center space-y-4">
                  <div class="size-16 rounded-3xl bg-card border border-border flex items-center justify-center text-muted-foreground/20 shadow-sm">
                    <LayoutDashboardIcon class="size-8" />
                  </div>
                  <div class="space-y-1">
                    <h3 class="text-sm font-semibold text-foreground/40 uppercase tracking-[0.2em]">{{ $t('admin.dashboard_overview') }}</h3>
                    <p class="text-[11px] text-muted-foreground/60 max-w-xs font-medium">{{ $t('admin.dashboard_overview_desc') }}</p>
                  </div>
                </div>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="donations" class="pt-4">
            <div class="flex items-center justify-between mb-6">
              <h3 class="text-base font-medium text-foreground font-khmer">{{ $t('admin.donation_list') }}</h3>
              <Button @click="() => { editingItem = null; newDonation = { donorName: '', amount: 0, currency: 'USD', type: 'cash', itemName: '', itemQty: 1, paymentMethod: 'cash' }; showAddDonation = true }" size="sm" class="rounded-xl font-medium bg-primary hover:bg-orange-600 h-9">
                <PlusIcon class="mr-2 h-4 w-4" />
                {{ $t('admin.add_donation_short') }}
              </Button>
            </div>
            <div class="rounded-3xl border border-border bg-card overflow-hidden shadow-sm">
              <Table>
                <TableHeader class="bg-muted/30">
                  <TableRow class="border-b border-border/50">
                    <TableHead class="font-medium text-foreground text-[12px] py-4 pl-6 font-khmer">{{ $t('admin.table.donor_name') }}</TableHead>
                    <TableHead class="font-medium text-foreground text-[12px] py-4 text-right font-khmer">{{ $t('admin.table.amount') }}</TableHead>
                    <TableHead class="font-medium text-foreground text-[12px] py-4 text-center font-khmer">{{ $t('admin.table.method') }}</TableHead>
                    <TableHead class="font-medium text-foreground text-[12px] py-4 font-khmer">{{ $t('admin.table.type') }}</TableHead>
                    <TableHead class="font-medium text-foreground text-[12px] py-4 font-khmer">{{ $t('admin.table.date') }}</TableHead>
                    <TableHead class="font-medium text-foreground text-[12px] py-4 text-right pr-6 font-khmer">{{ $t('admin.table.actions') }}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow v-for="donation in donations" :key="donation.id" class="border-b border-border last:border-0 hover:bg-muted/30 transition-colors group">
                    <TableCell class="py-4 pl-6">
                      <div class="flex items-center gap-4">
                        <div class="size-11 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-medium text-sm ring-1 ring-primary/20">
                          {{ donation.donorName.charAt(0).toUpperCase() }}
                        </div>
                        <span class="font-medium text-base text-foreground font-khmer">{{ donation.donorName }}</span>
                      </div>
                    </TableCell>
                    <TableCell class="text-right py-4">
                      <div class="flex flex-col items-end">
                        <span class="font-medium text-lg" :class="donation.currency === 'USD' ? 'text-primary' : 'text-emerald-600'">
                          {{ donation.currency === 'KHR' ? '៛' : '$' }} {{ Number(donation.amount).toLocaleString() }}
                        </span>
                        <span class="text-[11px] font-medium text-muted-foreground">{{ donation.currency }}</span>
                      </div>
                    </TableCell>
                    <TableCell class="text-center py-4">
                      <div class="flex justify-center">
                        <Badge variant="outline" class="uppercase text-[11px] font-bold px-4 py-1.5 bg-muted/50 text-foreground border-border rounded-xl group-hover:bg-card transition-colors">
                          <span v-if="donation.paymentMethod === 'cash'" class="mr-2 size-2 rounded-full bg-orange-500"></span>
                          <span v-else-if="donation.paymentMethod === 'aba'" class="mr-2 size-2 rounded-full bg-blue-500"></span>
                          <span v-else class="mr-2 size-2 rounded-full bg-emerald-500"></span>
                          {{ $t('donation.type_' + (donation.paymentMethod || 'cash')) }}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell class="py-4">
                      <div class="flex items-center gap-3">
                        <div class="size-7 rounded-lg flex items-center justify-center ring-1 shadow-sm" :class="donation.type === 'cash' ? 'bg-emerald-500/10 ring-emerald-500/20 text-emerald-600' : 'bg-orange-500/10 ring-orange-500/20 text-orange-600'">
                           <DollarSign v-if="donation.type === 'cash'" class="size-4" />
                           <Trophy v-else class="size-4" />
                        </div>
                        <span class="text-sm font-bold text-foreground">{{ donation.type === 'cash' ? $t('donation.type_cash') : $t('donation.type_item') }}</span>
                      </div>
                    </TableCell>
                    <TableCell class="text-sm text-muted-foreground py-4 font-bold tabular-nums font-khmer">{{ formatDate(donation.createdAt) }}</TableCell>
                    <TableCell class="text-right py-4 pr-6">
                      <div class="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button variant="ghost" size="icon" class="size-8 rounded-lg text-muted-foreground hover:text-primary hover:bg-primary/5" @click="openEditDonation(donation)">
                          <PencilIcon class="size-4" />
                        </Button>
                        <Button v-if="authStore.isAdmin" variant="ghost" size="icon" class="size-8 rounded-lg text-muted-foreground hover:text-rose-600 hover:bg-rose-50" @click="confirmDeleteItem(donation, 'donation')">
                          <Trash2Icon class="size-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                  <TableRow v-if="donations.length === 0">
                    <TableCell colspan="6" class="h-32 text-center text-slate-300 italic font-medium">
                      {{ $t('projects.no_donors') }}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </TabsContent>

          <TabsContent value="expenses" class="pt-4">
            <div class="flex items-center justify-between mb-6">
              <h3 class="text-base font-bold text-foreground font-khmer uppercase tracking-tight">{{ $t('admin.expense_list') }}</h3>
              <Button @click="() => { editingItem = null; newExpense = { title: '', amount: 0, currency: 'USD', category: 'material', payee: '', receiptUrl: '' }; showAddExpense = true }" size="sm" class="rounded-xl font-bold bg-primary hover:bg-orange-600 h-9">
                <PlusIcon class="mr-2 h-4 w-4" />
                {{ $t('admin.add_expense') }}
              </Button>
            </div>
            <div class="rounded-3xl border border-border bg-card overflow-hidden shadow-sm">
              <Table>
                <TableHeader class="bg-muted/30">
                  <TableRow class="border-b border-border/50">
                    <TableHead class="font-medium text-foreground text-[12px] py-4 pl-6 font-khmer">{{ $t('admin.table.expense_title') }}</TableHead>
                    <TableHead class="font-medium text-foreground text-[12px] py-4 text-right font-khmer">{{ $t('admin.table.amount') }}</TableHead>
                    <TableHead class="font-medium text-foreground text-[12px] py-4 text-center font-khmer">{{ $t('admin.table.category') }}</TableHead>
                    <TableHead class="font-medium text-foreground text-[12px] py-4 font-khmer">{{ $t('admin.table.receipt_payee') }}</TableHead>
                    <TableHead class="font-medium text-foreground text-[12px] py-4 font-khmer">{{ $t('admin.table.date') }}</TableHead>
                    <TableHead class="font-medium text-foreground text-[12px] py-4 text-right pr-6 font-khmer">{{ $t('admin.table.actions') }}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow v-for="expense in expenses" :key="expense.id" class="border-b border-border last:border-0 hover:bg-muted/30 transition-colors group">
                    <TableCell class="py-5 pl-6">
                       <span class="font-bold text-base text-foreground font-khmer">{{ expense.title }}</span>
                    </TableCell>
                    <TableCell class="text-right py-5">
                      <div class="flex flex-col items-start">
                        <span class="text-rose-600 font-medium text-lg">
                          -{{ expense.currency === 'KHR' ? '៛' : '$' }} {{ (Number(expense.amount) || 0).toLocaleString(undefined, { minimumFractionDigits: 2 }) }}
                        </span>
                        <span class="text-[11px] font-medium text-rose-500">{{ expense.currency }}</span>
                      </div>
                    </TableCell>
                    <TableCell class="text-center py-5">
                      <div class="flex justify-center">
                        <Badge variant="outline" class="bg-muted text-foreground border-border uppercase text-[11px] font-bold px-4 py-1.5 rounded-xl group-hover:bg-card transition-colors">
                          {{ $t('admin.expense_categories.' + (expense.category || 'other')) }}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell class="py-5">
                      <div class="flex flex-col gap-1">
                        <span class="text-base font-bold text-foreground font-khmer leading-none">{{ expense.payee }}</span>
                        <a v-if="expense.receiptUrl" :href="expense.receiptUrl" target="_blank" class="text-[11px] text-primary flex items-center hover:underline font-bold transition-all uppercase tracking-widest mt-1">
                          <PaperclipIcon class="size-4 mr-1.5" /> {{ $t('admin.table.view_receipt') }}
                        </a>
                      </div>
                    </TableCell>
                    <TableCell class="text-sm text-muted-foreground py-5 font-bold tabular-nums font-khmer">{{ formatDate(expense.createdAt) }}</TableCell>
                    <TableCell class="text-right py-4 pr-6">
                      <div class="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button variant="ghost" size="icon" class="size-8 rounded-lg text-muted-foreground hover:text-primary hover:bg-primary/5" @click="openEditExpense(expense)">
                          <PencilIcon class="size-4" />
                        </Button>
                        <Button v-if="authStore.isAdmin" variant="ghost" size="icon" class="size-8 rounded-lg text-muted-foreground hover:text-rose-600 hover:bg-rose-50" @click="confirmDeleteItem(expense, 'expense')">
                          <Trash2Icon class="size-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                  <TableRow v-if="expenses.length === 0">
                    <TableCell colspan="6" class="h-32 text-center text-slate-300 italic font-medium">
                      {{ $t('admin.no_expenses') }}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </TabsContent>

          <TabsContent value="updates" class="pt-4">
            <div class="flex items-center justify-between mb-6">
              <h3 class="text-base font-medium text-foreground font-khmer">{{ $t('admin.project_updates') }}</h3>
              <Button @click="() => { editingItem = null; newUpdate = { title: '', description: '', imageUrl: '' }; showAddUpdate = true }" size="sm" class="rounded-xl font-medium bg-primary hover:bg-orange-600 h-9">
                <PlusIcon class="mr-2 h-4 w-4" />
                {{ $t('admin.create_update') }}
              </Button>
            </div>
            
            <div v-if="updates.length === 0" class="text-center py-16 border-2 border-dashed border-border rounded-3xl">
              <FileTextIcon class="mx-auto h-12 w-12 text-muted-foreground/20 mb-4" />
              <p class="text-muted-foreground font-medium">{{ $t('admin.no_updates') }}</p>
            </div>

            <div v-else class="grid gap-6">
              <Card v-for="update in updates" :key="update.id" class="rounded-3xl border border-border overflow-hidden shadow-sm bg-card hover:shadow-xl transition-all">
                <div class="flex flex-col md:flex-row gap-6 p-6">
                  <div v-if="update.imageUrl" class="md:w-56 md:h-36 shrink-0 bg-muted rounded-2xl overflow-hidden border border-border">
                    <img :src="update.imageUrl" class="w-full h-full object-cover transition-transform duration-500 hover:scale-105" />
                  </div>
                  <div class="flex-1 flex flex-col justify-between">
                    <div>
                      <div class="flex items-center justify-between mb-3">
                        <h4 class="text-2xl font-medium text-foreground font-khmer">{{ update.title }}</h4>
                        <span class="text-xs font-medium text-muted-foreground flex items-center gap-2 font-khmer">
                          <CheckIcon class="w-4 h-4 text-emerald-500" />
                          {{ formatDate(update.createdAt) }}
                        </span>
                      </div>
                      <p class="text-foreground text-base whitespace-pre-wrap leading-relaxed font-khmer">{{ update.description }}</p>
                    </div>
                    <div class="flex justify-end gap-3 mt-6">
                      <Button variant="outline" size="sm" class="h-8 rounded-lg border-border font-medium hover:bg-muted" @click="openEditUpdate(update)">
                        {{ $t('admin.edit') }}
                      </Button>
                      <Button v-if="authStore.isAdmin" variant="outline" size="sm" class="h-8 rounded-lg border-border font-medium hover:bg-rose-50 hover:text-rose-600" @click="confirmDeleteItem(update, 'update')">
                        {{ $t('admin.delete') }}
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="analytics" class="space-y-6 pt-6">
            <div class="grid gap-6 md:grid-cols-3">
              <Card class="rounded-3xl border border-border shadow-sm bg-card hover:shadow-lg transition-all">
                <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle class="text-[10px] font-medium text-muted-foreground/60">{{ $t('admin.analytics_labels.avg_donation') }}</CardTitle>
                  <div class="size-8 rounded-xl bg-blue-50 flex items-center justify-center">
                    <DollarSign class="h-4 w-4 text-blue-600" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div class="text-2xl font-medium text-foreground">{{ $t('common.currency_usd') }} {{ analyticsStats.avgDonation.toFixed(2) }}</div>
                </CardContent>
              </Card>
              <Card class="rounded-3xl border border-border shadow-sm bg-card hover:shadow-lg transition-all">
                <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle class="text-[10px] font-medium text-muted-foreground/60">{{ $t('admin.analytics_labels.max_donation') }}</CardTitle>
                  <div class="size-8 rounded-xl bg-amber-50 flex items-center justify-center">
                    <Trophy class="h-4 w-4 text-emerald-600" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div class="text-2xl font-medium text-foreground font-khmer">{{ $t('common.currency_usd') }} {{ analyticsStats.maxDonation.toFixed(2) }}</div>
                  <p class="text-[10px] font-bold text-muted-foreground/60 mt-1">ដោយ {{ analyticsStats.maxDonorName }}</p>
                </CardContent>
              </Card>
              <Card class="rounded-3xl border border-border shadow-sm bg-card hover:shadow-lg transition-all">
                <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle class="text-[10px] font-medium text-muted-foreground/60">{{ $t('admin.analytics_labels.transactions') }}</CardTitle>
                  <div class="size-8 rounded-xl bg-emerald-50 flex items-center justify-center">
                    <Users class="h-4 w-4 text-emerald-600" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div class="text-2xl font-medium text-foreground">{{ donations.length }} <span class="text-sm font-medium text-muted-foreground/60">{{ $t('admin.analytics_labels.times') }}</span></div>
                </CardContent>
              </Card>
            </div>

            <div class="grid gap-6 md:grid-cols-2">
              <!-- Expenses by Category -->
              <Card class="rounded-3xl border border-border shadow-sm bg-card hover:shadow-lg transition-all">
                <CardHeader>
                  <CardTitle class="text-base font-medium text-foreground font-khmer">{{ $t('admin.analytics_labels.expenses_by_category') }}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div class="space-y-5">
                    <div v-for="(amount, category) in analyticsStats.expensesByCategory" :key="category" class="space-y-2">
                      <div class="flex items-center justify-between text-xs font-medium">
                        <span class="capitalize text-muted-foreground">{{ $t('admin.expense_categories.' + category) }}</span>
                        <span class="text-rose-600">{{ $t('common.currency_usd') }} {{ amount.toFixed(2) }}</span>
                      </div>
                      <div class="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                        <div class="h-full bg-rose-500 rounded-full transition-all duration-1000" :style="{ width: `${(amount / analyticsStats.totalExpensesUsd * 100) || 0}%` }"></div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <!-- Donation Methods -->
              <Card class="rounded-3xl border border-border shadow-sm bg-card hover:shadow-lg transition-all">
                <CardHeader>
                  <CardTitle class="text-base font-bold text-foreground font-khmer">{{ $t('admin.analytics_labels.donation_methods') }}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div class="space-y-5">
                    <div v-for="(count, method) in analyticsStats.donationsByMethod" :key="method" class="space-y-2">
                      <div class="flex items-center justify-between text-xs font-bold">
                        <span class="capitalize text-muted-foreground">{{ method === 'qr' ? 'KHQR' : $t('donation.type_' + method) }}</span>
                        <div class="flex items-center gap-2">
                          <span class="text-blue-600">{{ count }} {{ $t('admin.analytics_labels.times') }}</span>
                          <span class="text-[10px] text-slate-300">({{ ((count / donations.length) * 100).toFixed(0) }}%)</span>
                        </div>
                      </div>
                      <div class="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                        <div class="h-full bg-blue-500 rounded-full transition-all duration-1000" :style="{ width: `${((count / donations.length) * 100) || 0}%` }"></div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </template>

    <!-- Add Donation Modal -->
    <Dialog v-model:open="showAddDonation">
      <DialogContent class="max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl p-0 border-none bg-card shadow-lg">
        <div class="p-8 space-y-8">
            <DialogHeader>
              <DialogTitle class="text-xl font-semibold text-foreground font-khmer">{{ editingItem ? $t('admin.forms.edit_donation') : $t('admin.forms.add_donation') }}</DialogTitle>
              <DialogDescription class="font-normal text-muted-foreground">{{ $t('admin.forms.project_settings_desc') }}</DialogDescription>
            </DialogHeader>
        <form @submit.prevent="handleSaveDonation" class="space-y-4 py-4">
          <div class="grid gap-2">
            <Label class="text-xs font-medium text-foreground/70">{{ $t('admin.forms.donor_name') }} *</Label>
            <Input v-model="newDonation.donorName" :placeholder="$t('admin.forms.placeholder_donor')" required class="rounded-xl border-border bg-muted/30 font-normal focus:bg-background transition-all h-11" />
          </div>
          
          <div class="grid gap-4 md:grid-cols-2">
            <div class="grid gap-2">
              <Label class="text-xs font-medium text-foreground/70">{{ $t('admin.forms.amount') }} *</Label>
              <div class="flex gap-2">
                <Input v-model.number="newDonation.amount" type="number" step="0.01" class="flex-1 rounded-xl border-border bg-muted/30 font-normal focus:bg-background transition-all h-11" required />
                <Select v-model="newDonation.currency">
                  <SelectTrigger class="w-[85px] rounded-xl border-border bg-muted/30 font-normal focus:bg-background transition-all h-11">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent class="rounded-xl p-1 shadow-lg border-border bg-card z-[100]">
                    <SelectItem value="USD" class="rounded-lg font-normal">$</SelectItem>
                    <SelectItem value="KHR" class="rounded-lg font-normal">៛</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div class="grid gap-2">
              <Label class="text-xs font-medium text-foreground/70">{{ $t('admin.forms.type') }} *</Label>
              <Select v-model="newDonation.type">
                <SelectTrigger class="rounded-xl border-border bg-muted/30 font-normal focus:bg-background transition-all h-11">
                  <SelectValue :placeholder="$t('admin.forms.select')" />
                </SelectTrigger>
                <SelectContent class="rounded-xl p-1 shadow-lg border-border bg-card z-[100]">
                  <SelectItem value="cash" class="rounded-lg font-normal">{{ $t('donation.type_cash') }}</SelectItem>
                  <SelectItem value="item" class="rounded-lg font-normal">{{ $t('donation.type_item') }}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div class="grid gap-4 md:grid-cols-2">
            <div class="grid gap-2">
              <Label class="text-xs font-medium text-foreground/70">{{ $t('admin.forms.payment_method') }} *</Label>
              <Select v-model="newDonation.paymentMethod">
                <SelectTrigger class="rounded-xl border-border bg-muted/30 font-normal focus:bg-background transition-all h-11">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent class="rounded-xl p-1 shadow-lg border-border bg-card z-[100]">
                  <SelectItem value="cash" class="rounded-lg font-normal">{{ $t('donation.type_cash') }}</SelectItem>
                  <SelectItem value="aba" class="rounded-lg font-normal">{{ $t('donation.type_aba') }}</SelectItem>
                  <SelectItem value="acleda" class="rounded-lg font-normal">{{ $t('donation.type_acleda') }}</SelectItem>
                  <SelectItem value="wing" class="rounded-lg font-normal">{{ $t('donation.type_wing') }}</SelectItem>
                  <SelectItem value="qr" class="rounded-lg font-normal">{{ $t('donation.type_qr') }} (Universal)</SelectItem>
                  <SelectItem value="other_bank" class="rounded-lg font-normal">{{ $t('donation.type_other_bank') }}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div v-if="newDonation.type === 'item'" class="grid gap-2">
              <Label>{{ $t('admin.forms.item_qty') }}</Label>
              <Input v-model.number="newDonation.itemQty" type="number" />
            </div>
          </div>

          <div v-if="newDonation.type === 'item'" class="grid gap-2">
            <Label>{{ $t('admin.forms.item_name') }}</Label>
            <Input v-model="newDonation.itemName" :placeholder="$t('admin.forms.placeholder_item')" />
          </div>

          <DialogFooter class="flex flex-row gap-3 pt-4">
            <Button type="button" variant="outline" class="flex-1 rounded-xl h-11 font-medium border-border text-muted-foreground hover:bg-muted bg-background/50" @click="showAddDonation = false">{{ $t('admin.forms.cancel') }}</Button>
            <Button type="submit" class="flex-1 rounded-xl h-11 font-medium bg-primary text-white hover:bg-primary/90 shadow-sm" :disabled="saving">
              <span v-if="saving" class="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
              {{ $t('admin.forms.save') }}
            </Button>
          </DialogFooter>
        </form>
        </div>
      </DialogContent>
    </Dialog>

    <!-- Add Expense Modal -->
    <Dialog v-model:open="showAddExpense">
      <DialogContent class="max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl p-0 border-none bg-card shadow-lg">
        <div class="p-8 space-y-8">
            <DialogHeader>
              <DialogTitle class="text-xl font-semibold text-foreground font-khmer">{{ editingItem ? $t('admin.forms.edit_expense') : $t('admin.forms.add_expense') }}</DialogTitle>
              <DialogDescription class="font-normal text-muted-foreground">{{ $t('admin.forms.project_settings_desc') }}</DialogDescription>
            </DialogHeader>
        <form @submit.prevent="handleSaveExpense" class="space-y-4 py-4">
          <div class="grid gap-2">
            <Label class="text-xs font-medium uppercase tracking-wider text-muted-foreground/80">{{ $t('admin.forms.expense_title') }} *</Label>
            <Input v-model="newExpense.title" :placeholder="$t('admin.forms.placeholder_expense')" required class="rounded-xl border-border bg-muted/30 font-normal focus:bg-background transition-all h-11" />
          </div>
          <div class="grid gap-4 md:grid-cols-2">
            <div class="grid gap-2">
              <Label class="text-xs font-medium text-foreground/70">{{ $t('admin.forms.amount') }} *</Label>
              <div class="flex gap-2">
                <Input v-model.number="newExpense.amount" type="number" step="0.01" class="flex-1 rounded-xl border-border bg-muted/30 font-normal focus:bg-background transition-all h-11" required />
                <Select v-model="newExpense.currency">
                  <SelectTrigger class="w-[85px] rounded-xl border-border bg-muted/30 font-normal focus:bg-background transition-all h-11">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent class="rounded-xl p-1 shadow-lg border-border bg-card z-[100]">
                    <SelectItem value="USD" class="rounded-lg font-normal">$</SelectItem>
                    <SelectItem value="KHR" class="rounded-lg font-normal">៛</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div class="grid gap-2">
              <Label>{{ $t('admin.forms.type') }}</Label>
              <Select v-model="newExpense.category">
                <SelectTrigger>
                  <SelectValue :placeholder="$t('admin.forms.select')" />
                </SelectTrigger>
                <SelectContent class="z-[100]">
                  <SelectItem value="material">{{ $t('admin.expense_categories.material') }}</SelectItem>
                  <SelectItem value="labor">{{ $t('admin.expense_categories.labor') }}</SelectItem>
                  <SelectItem value="food">{{ $t('admin.expense_categories.food') }}</SelectItem>
                  <SelectItem value="utility">{{ $t('admin.expense_categories.utility') }}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div class="grid gap-2">
            <Label>{{ $t('admin.table.receipt_payee') }} (Payee)</Label>
            <Input v-model="newExpense.payee" placeholder="ឧ. ជាង..." />
          </div>
          <div class="grid gap-2">
            <Label>{{ $t('admin.forms.receipt') }}</Label>
            <div class="flex gap-2">
              <Input type="file" accept="image/*" @change="handleReceiptUpload" class="flex-1" />
              <Button type="button" variant="outline" size="sm" :disabled="uploadingReceipt" v-if="uploadingReceipt">
                <span class="mr-2 h-3 w-3 animate-spin rounded-full border-2 border-primary border-t-transparent"></span>
                {{ $t('admin.uploading') }}
              </Button>
            </div>
            <div v-if="newExpense.receiptUrl" class="text-xs text-emerald-600 flex items-center gap-1.5">
              <CheckIcon class="h-3.5 w-3.5" /> {{ $t('donation.status_verified') }}
            </div>
          </div>
          <DialogFooter class="flex flex-row gap-3 pt-4">
            <Button type="button" variant="outline" class="flex-1 rounded-xl h-11 font-medium border-border text-muted-foreground hover:bg-muted bg-background/50" @click="showAddExpense = false">{{ $t('admin.forms.cancel') }}</Button>
            <Button type="submit" class="flex-1 rounded-xl h-11 font-medium bg-primary text-white hover:bg-primary/90 shadow-sm" :disabled="saving">
              <span v-if="saving" class="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
              {{ $t('admin.add_expense') }}
            </Button>
          </DialogFooter>
        </form>
        </div>
      </DialogContent>
    </Dialog>
    <!-- Delete Item Confirmation -->
    <Dialog v-model:open="showDeleteConfirmItem">
      <DialogContent class="max-w-md rounded-2xl p-8 border-none bg-card shadow-lg">
        <DialogHeader class="space-y-4 text-center items-center">
          <div class="h-14 w-14 rounded-2xl bg-rose-500/5 flex items-center justify-center text-rose-500 border border-rose-500/10">
             <Trash2Icon class="h-7 w-7" />
          </div>
          <DialogTitle class="text-xl font-semibold text-foreground font-khmer text-center">
            {{ $t('admin.confirmations.delete_title', { type: $t('admin.confirmations.delete_types.' + itemTypeToDelete) }) }}
          </DialogTitle>
          <DialogDescription class="font-normal text-muted-foreground leading-relaxed text-center">
            {{ $t('admin.confirmations.delete_desc', { name: itemTypeToDelete === 'donation' ? itemToDelete?.donorName : itemToDelete?.title }) }}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter class="grid grid-cols-2 gap-3 pt-8">
          <Button variant="outline" @click="showDeleteConfirmItem = false" class="rounded-xl h-11 font-medium border-border text-muted-foreground hover:bg-muted bg-background/50">{{ $t('admin.forms.cancel') }}</Button>
          <Button variant="destructive" @click="handleDeleteItem" :disabled="deletingItem" class="rounded-xl h-11 font-medium bg-rose-500 hover:bg-rose-600 shadow-sm">
            <span v-if="deletingItem" class="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
            {{ $t('admin.confirmations.confirm_delete') }}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
    <!-- Add Update Modal -->
    <Dialog v-model:open="showAddUpdate">
      <DialogContent class="max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl p-0 border-none bg-card shadow-lg">
        <div class="p-8 space-y-8">
            <DialogHeader>
              <DialogTitle class="text-xl font-semibold text-foreground font-khmer">{{ editingItem ? $t('admin.forms.edit_update') : $t('admin.forms.add_update') }}</DialogTitle>
              <DialogDescription class="font-normal text-muted-foreground">{{ $t('admin.forms.project_settings_desc') }}</DialogDescription>
            </DialogHeader>
        <form @submit.prevent="handleSaveUpdate" class="space-y-4 py-4">
          <div class="grid gap-2">
            <Label>{{ $t('admin.forms.update_title') }}</Label>
            <Input v-model="newUpdate.title" :placeholder="$t('admin.forms.placeholder_update_title')" required />
          </div>
          
          <div class="grid gap-2">
            <Label>{{ $t('admin.forms.update_content') }}</Label>
            <Textarea 
              v-model="newUpdate.description" 
              :placeholder="$t('admin.forms.placeholder_update_content')" 
              rows="5"
              required
            />
          </div>

          <div class="grid gap-2">
            <Label>រូបភាព (បើមាន)</Label>
            <div class="flex gap-2">
              <Input type="file" id="update-image-upload" class="flex-1" accept="image/*" @change="handleUpdateImageUpload" />
              <Button type="button" variant="outline" size="sm" :disabled="uploadingUpdateImage" v-if="uploadingUpdateImage">
                <span class="mr-2 h-3 w-3 animate-spin rounded-full border-2 border-primary border-t-transparent"></span>
                {{ $t('admin.uploading') }}
              </Button>
            </div>
            <img v-if="newUpdate.imageUrl" :src="newUpdate.imageUrl" class="mt-2 w-full h-48 object-cover rounded-lg border" />
          </div>

          <DialogFooter class="flex flex-row gap-3 pt-4">
            <Button type="button" variant="outline" class="flex-1 rounded-xl h-11 font-medium border-border text-muted-foreground hover:bg-muted bg-background/50" @click="showAddUpdate = false">{{ $t('admin.forms.cancel') }}</Button>
            <Button type="submit" class="flex-1 rounded-xl h-11 font-medium bg-primary text-white hover:bg-primary/90 shadow-sm" :disabled="saving">
              <span v-if="saving" class="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
              {{ editingItem ? $t('admin.forms.save_changes') : $t('admin.forms.submit_update') }}
            </Button>
          </DialogFooter>
        </form>
        </div>
      </DialogContent>
    </Dialog>

    <!-- Edit Project Settings Modal -->
    <Dialog v-model:open="showEditProjectModal">
      <DialogContent class="max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl p-0 border-none bg-card shadow-lg">
        <div class="p-8 space-y-8">
            <DialogHeader>
              <DialogTitle class="text-xl font-semibold text-foreground font-khmer">{{ $t('admin.forms.project_settings') }}</DialogTitle>
              <DialogDescription class="font-normal text-muted-foreground">{{ $t('admin.forms.project_settings_desc') }}</DialogDescription>
            </DialogHeader>
        <form @submit.prevent="handleUpdateProjectSettings" class="space-y-4 py-4">
          <div class="grid gap-2">
            <Label>{{ $t('admin.forms.project_name') }}</Label>
            <Input v-model="projectEditForm.title" required />
          </div>
          
          <div class="grid gap-2">
            <Label>{{ $t('admin.forms.project_desc') }}</Label>
            <Textarea 
              v-model="projectEditForm.description" 
              rows="4"
              required
            />
          </div>

          <div class="grid gap-4 md:grid-cols-2">
            <div class="grid gap-2">
              <Label>{{ $t('admin.forms.goal_amount') }} ($)</Label>
              <Input v-model.number="projectEditForm.goalAmount" type="number" required />
            </div>
            <div class="grid gap-2">
              <Label>{{ $t('admin.forms.status') }}</Label>
              <Select v-model="projectEditForm.status">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent class="z-[100]">
                  <SelectItem value="active">{{ $t('common.status_active') }}</SelectItem>
                  <SelectItem value="paused">{{ $t('common.status_paused') }}</SelectItem>
                  <SelectItem value="completed" :disabled="!authStore.isAdmin">
                    {{ $t('common.status_completed') }} {{ !authStore.isAdmin ? '(Admin Only)' : '' }}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter class="flex flex-row gap-3 pt-4">
            <Button type="button" variant="outline" class="flex-1 rounded-xl h-11 font-medium border-border text-muted-foreground hover:bg-muted bg-background/50" @click="showEditProjectModal = false">{{ $t('admin.forms.cancel') }}</Button>
            <Button type="submit" class="flex-1 rounded-xl h-11 font-medium bg-primary text-white hover:bg-primary/90 shadow-sm" :disabled="saving">
              <span v-if="saving" class="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
              {{ $t('admin.forms.save') }}
            </Button>
          </DialogFooter>
        </form>
        </div>
      </DialogContent>
    </Dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { ExternalLinkIcon, PlusIcon, CheckIcon, PaperclipIcon, RefreshCw, FileTextIcon, DownloadIcon, DollarSign, Trophy, Users, ArrowLeftIcon, SettingsIcon, Trash2Icon, ArrowUpRightIcon, ArrowDownLeftIcon, WalletIcon, BarChart3Icon, LayoutDashboardIcon, PencilIcon } from 'lucide-vue-next'
import { formatKhmerDate } from '~/utils/date'
import { useRoute } from 'vue-router'
import { useProjects } from '~/composables/useProjects'
import { useCloudinary } from '~/composables/useCloudinary'
import { useAuthStore } from '~/stores/auth'
import { useKhrRate } from '~/composables/useKhrRate'


const route = useRoute()
const { 
  getProject, 
  updateProject, 
  donations, 
  expenses, 
  fetchDonations, 
  fetchExpenses, 
  addDonation, 
  addExpense,
  updateDonation,
  deleteDonation,
  updateExpense,
  deleteExpense,
  recalculateProjectProgress,
  updates,
  fetchUpdates,
  addUpdate,
  updateUpdate,
  deleteUpdate
} = useProjects()
const { uploadImage } = useCloudinary()
const authStore = useAuthStore()
const { khrRate } = useKhrRate()

const project = ref<any>(null)
const loading = ref(true)
const activeTab = ref('overview')
const saving = ref(false)

const uploadingReceipt = ref(false)
const updatingQR = ref(false)
const recalculating = ref(false)

const handleRecalculate = async () => {
  recalculating.value = true
  try {
    await recalculateProjectProgress(project.value.id)
    const data = await getProject(project.value.id)
    if (data) project.value = data
  } catch (err) {
    console.error(err)
  } finally {
    recalculating.value = false
  }
}

const handleReceiptUpload = async (event: any) => {
  const file = event.target.files?.[0]
  if (!file) return

  uploadingReceipt.value = true
  try {
    const url = await uploadImage(file)
    newExpense.value.receiptUrl = url
  } catch (err) {
    console.error('Receipt upload failed:', err)
  } finally {
    uploadingReceipt.value = false
  }
}

const triggerQRUpload = () => {
  document.getElementById('qr-upload')?.click()
}

const handleUpdateQR = async (event: any) => {
  const file = event.target.files?.[0]
  if (!file) return

  updatingQR.value = true
  try {
    const url = await uploadImage(file)
    await updateProject(project.value.id, { qrCodeUrl: url })
    project.value.qrCodeUrl = url
  } catch (err) {
    console.error('QR update failed:', err)
  } finally {
    updatingQR.value = false
  }
}

const totalDonations = computed(() => {
  return donations.value.reduce((acc, d) => {
    const amount = Number(d.amount) || 0
    if (d.currency === 'KHR') {
      acc.khr += amount
    } else {
      acc.usd += amount
    }
    return acc
  }, { usd: 0, khr: 0 })
})

const totalExpenses = computed(() => {
  return expenses.value.reduce((acc, e) => {
    const amount = Number(e.amount) || 0
    if (e.currency === 'KHR') {
      acc.khr += amount
    } else {
      acc.usd += amount
    }
    return acc
  }, { usd: 0, khr: 0 })
})

const totalBalance = computed(() => {
  return {
    usd: totalDonations.value.usd - totalExpenses.value.usd,
    khr: totalDonations.value.khr - totalExpenses.value.khr
  }
})

const analyticsStats = computed(() => {
  const totalUsd = totalDonations.value.usd + (totalDonations.value.khr / khrRate.value)
  const avg = donations.value.length ? totalUsd / donations.value.length : 0

  let max = 0
  let maxName = '-'
  donations.value.forEach(d => {
    const val = Number(d.amount) / (d.currency === 'KHR' ? khrRate.value : 1)
    if (val > max) {
      max = val
      maxName = d.donorName
    }
  })

  const expByCat: Record<string, number> = {}
  expenses.value.forEach(e => {
    const val = Number(e.amount) / (e.currency === 'KHR' ? khrRate.value : 1)
    expByCat[e.category] = (expByCat[e.category] || 0) + val
  })

  const donByMethod: Record<string, number> = {}
  donations.value.forEach(d => {
    const method = d.paymentMethod || 'cash'
    donByMethod[method] = (donByMethod[method] || 0) + 1
  })

  const totalExpUsd = totalExpenses.value.usd + (totalExpenses.value.khr / khrRate.value)

  return {
    avgDonation: avg,
    maxDonation: max,
    maxDonorName: maxName,
    expensesByCategory: expByCat,
    donationsByMethod: donByMethod,
    totalExpensesUsd: totalExpUsd
  }
})

const projectProgress = computed(() => {
  if (!project.value || !project.value.goalAmount) return 0
  const totalUsd = totalDonations.value.usd + (totalDonations.value.khr / khrRate.value)
  const percent = (totalUsd / project.value.goalAmount) * 100
  return Math.min(Math.round(percent), 100)
})

const showAddDonation = ref(false)
const showAddExpense = ref(false)
const showDeleteConfirmItem = ref(false)
const showEditProjectModal = ref(false)
const deletingItem = ref(false)

const projectEditForm = ref({
  title: '',
  description: '',
  goalAmount: 0,
  status: 'active' as 'draft' | 'active' | 'paused' | 'completed'
})

const editingItem = ref<any>(null)
const itemToDelete = ref<any>(null)
const itemTypeToDelete = ref<'donation' | 'expense' | 'update'>('donation')

const openEditDonation = (donation: any) => {
  editingItem.value = donation
  newDonation.value = { ...donation }
  showAddDonation.value = true
}

const openEditExpense = (expense: any) => {
  editingItem.value = expense
  newExpense.value = { ...expense }
  showAddExpense.value = true
}

const openEditProjectSettings = () => {
  if (!project.value) return
  projectEditForm.value = {
    title: project.value.title,
    description: project.value.description,
    goalAmount: project.value.goalAmount || 0,
    status: project.value.status || 'active'
  }
  showEditProjectModal.value = true
}

const handleUpdateProjectSettings = async () => {
  saving.value = true
  try {
    await updateProject(project.value.id, { ...projectEditForm.value })
    // Update local state
    project.value = { ...project.value, ...projectEditForm.value }
    showEditProjectModal.value = false
  } catch (err) {
    console.error(err)
  } finally {
    saving.value = false
  }
}

const confirmDeleteItem = (item: any, type: 'donation' | 'expense' | 'update') => {
  itemToDelete.value = item
  itemTypeToDelete.value = type
  showDeleteConfirmItem.value = true
}

const handleDeleteItem = async () => {
  if (!itemToDelete.value) return
  deletingItem.value = true
  try {
    if (itemTypeToDelete.value === 'donation') {
      await deleteDonation(project.value.id, itemToDelete.value.id)
    } else if (itemTypeToDelete.value === 'expense') {
      await deleteExpense(project.value.id, itemToDelete.value.id)
    } else if (itemTypeToDelete.value === 'update') {
      await deleteUpdate(project.value.id, itemToDelete.value.id)
    }
    showDeleteConfirmItem.value = false
    itemToDelete.value = null
  } catch (err) {
    console.error(err)
  } finally {
    deletingItem.value = false
  }
}

const newDonation = ref({
  donorName: '',
  amount: 0,
  currency: 'USD',
  type: 'cash',
  itemName: '',
  itemQty: 1,
  paymentMethod: 'cash'
})

const newExpense = ref({
  title: '',
  amount: 0,
  currency: 'USD',
  category: 'material',
  payee: '',
  receiptUrl: ''
})

const showAddUpdate = ref(false)
const uploadingUpdateImage = ref(false)
const newUpdate = ref({
  title: '',
  description: '',
  imageUrl: ''
})

const openEditUpdate = (update: any) => {
  editingItem.value = update
  newUpdate.value = { ...update }
  showAddUpdate.value = true
}

const handleSaveUpdate = async () => {
  saving.value = true
  try {
    if (editingItem.value) {
      await updateUpdate(project.value.id, editingItem.value.id, { ...newUpdate.value })
    } else {
      await addUpdate(project.value.id, { ...newUpdate.value })
    }
    showAddUpdate.value = false
    newUpdate.value = { title: '', description: '', imageUrl: '' }
    editingItem.value = null
  } catch (err) {
    console.error(err)
  } finally {
    saving.value = false
  }
}


const handleUpdateImageUpload = async (event: any) => {
  const file = event.target.files?.[0]
  if (!file) return
  uploadingUpdateImage.value = true
  try {
    const url = await uploadImage(file)
    newUpdate.value.imageUrl = url
  } catch (err) {
    console.error(err)
  } finally {
    uploadingUpdateImage.value = false
  }
}

const handleExportReport = () => {
  const headers = ['Date', 'Type', 'Description/Name', 'Amount (USD)', 'Amount (KHR)', 'Category/Method']
  const rows = [] as any[]
  
  donations.value.forEach(d => {
    const date = d.createdAt?.toDate ? d.createdAt.toDate() : new Date(d.createdAt)
    rows.push([
      date.toISOString().split('T')[0],
      'Income',
      d.donorName,
      d.currency === 'USD' ? d.amount : 0,
      d.currency === 'KHR' ? d.amount : 0,
      d.paymentMethod
    ])
  })

  expenses.value.forEach(e => {
    const date = e.createdAt?.toDate ? e.createdAt.toDate() : new Date(e.createdAt)
    rows.push([
      date.toISOString().split('T')[0],
      'Expense',
      e.title,
      e.currency === 'USD' ? -e.amount : 0,
      e.currency === 'KHR' ? -e.amount : 0,
      e.category
    ])
  })

  const csvContent = "data:text/csv;charset=utf-8," 
    + headers.join(",") + "\n" 
    + rows.map(e => e.join(",")).join("\n")

  const encodedUri = encodeURI(csvContent)
  const link = document.createElement("a")
  link.setAttribute("href", encodedUri)
  link.setAttribute("download", `report-${project.value.title}.csv`)
  document.body.appendChild(link)
  link.click()
}

let unsubDonations: any
let unsubExpenses: any
let unsubUpdates: any

onMounted(async () => {
  const data = await getProject(route.params.id as string)
  if (data) {
    project.value = data
    unsubDonations = fetchDonations(data.id!)
    unsubExpenses = fetchExpenses(data.id!)
    unsubUpdates = fetchUpdates(data.id!)
    handleRecalculate()
  }
  loading.value = false
})

onUnmounted(() => {
  if (unsubDonations) unsubDonations()
  if (unsubExpenses) unsubExpenses()
  if (unsubUpdates) unsubUpdates()
})

const handleSaveDonation = async () => {
  saving.value = true
  try {
    if (editingItem.value) {
      await updateDonation(project.value.id, editingItem.value.id, { ...newDonation.value })
    } else {
      await addDonation(project.value.id, { ...newDonation.value })
    }
    showAddDonation.value = false
    newDonation.value = { 
      donorName: '', 
      amount: 0, 
      currency: 'USD',
      type: 'cash', 
      itemName: '',
      itemQty: 1,
      paymentMethod: 'cash' 
    }
    editingItem.value = null
  } catch (err) {
    console.error(err)
  } finally {
    saving.value = false
  }
}

const handleSaveExpense = async () => {
  saving.value = true
  try {
    if (editingItem.value) {
      await updateExpense(project.value.id, editingItem.value.id, { ...newExpense.value })
    } else {
      await addExpense(project.value.id, { ...newExpense.value })
    }
    showAddExpense.value = false
    newExpense.value = { title: '', amount: 0, currency: 'USD', category: 'material', payee: '', receiptUrl: '' }
    editingItem.value = null
  } catch (err) {
    console.error(err)
  } finally {
    saving.value = false
  }
}

const formatDate = (date: any) => formatKhmerDate(date, 'dd/MM/yyyy HH:mm')
</script>

<route lang="yaml">
meta:
  layout: admin
</route>
