<template>
  <div class="space-y-10 p-2 md:p-4 transition-colors duration-300">
    <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 pb-2 animate-in fade-in slide-in-from-top-4 duration-700">
      <div class="space-y-1">
        <h2 class="text-3xl md:text-4xl font-medium text-foreground font-khmer">{{ $t('admin.dashboard') }}</h2>
        <p class="text-muted-foreground font-normal">{{ $t('admin.dashboard_subtitle') }}</p>
      </div>
      <div class="flex items-center gap-3">
        <Button variant="outline" size="icon" class="hidden md:flex rounded-xl border-border bg-card shadow-sm hover:bg-muted">
          <CalendarIcon class="h-4 w-4" />
        </Button>
        <Button variant="outline" @click="recalculateAll" :disabled="recalculatingAll" class="rounded-xl border-border bg-card shadow-sm hover:bg-muted font-medium px-6 h-10">
          <RefreshCwIcon class="mr-2 h-4 w-4" :class="{ 'animate-spin': recalculatingAll }" />
          <span class="hidden sm:inline">{{ $t('admin.recalculate') }}</span>
          <span class="sm:hidden">{{ $t('admin.recalculate') }}</span>
        </Button>
        <Button size="icon" variant="default" class="rounded-xl bg-primary hover:bg-orange-600 shadow-lg shadow-primary/20">
          <DownloadIcon class="h-4 w-4" />
        </Button>
      </div>
    </div>
    
    <Tabs default-value="overview" class="space-y-10">
      <TabsList class="bg-muted p-1 rounded-2xl inline-flex h-12 border border-border">
        <TabsTrigger value="overview" class="rounded-xl px-8 py-2 data-[state=active]:bg-card data-[state=active]:text-primary data-[state=active]:shadow-sm font-medium transition-all font-khmer">{{ $t('admin.tabs.overview') }}</TabsTrigger>
        <TabsTrigger value="analytics" class="rounded-xl px-8 py-2 data-[state=active]:bg-card data-[state=active]:text-primary data-[state=active]:shadow-sm font-medium transition-all font-khmer">{{ $t('admin.tabs.analytics') }}</TabsTrigger>
        <TabsTrigger value="reports" class="rounded-xl px-8 py-2 data-[state=active]:bg-card data-[state=active]:text-primary data-[state=active]:shadow-sm font-medium transition-all font-khmer">{{ $t('admin.tabs.reports') }}</TabsTrigger>
        <TabsTrigger value="notifications" class="rounded-xl px-8 py-2 data-[state=active]:bg-card data-[state=active]:text-primary data-[state=active]:shadow-sm font-medium transition-all font-khmer">{{ $t('admin.tabs.notifications') }}</TabsTrigger>
      </TabsList>
      
      <!-- Overview Tab -->
      <TabsContent value="overview" class="space-y-10 focus-visible:outline-none animate-in fade-in slide-in-from-bottom-4 duration-500">
        <!-- Metrics Cards Row 1: Projects -->
        <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <!-- Project Revenue -->
          <Card class="rounded-3xl border-none ring-1 ring-border shadow-sm bg-card overflow-hidden group transition-all">
            <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-3 bg-muted/30">
              <div>
                <p class="text-[9px] font-semibold text-primary/60 uppercase tracking-widest mb-0.5">{{ $t('admin.sidebar.projects') }}</p>
                <CardTitle class="text-[10px] font-medium text-muted-foreground/60 uppercase tracking-wider">{{ $t('admin.revenue') }}</CardTitle>
              </div>
              <div class="h-10 w-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500 border border-emerald-500/20">
                <DollarSignIcon class="h-5 w-5" />
              </div>
            </CardHeader>
            <CardContent class="pt-6">
              <div v-if="loading" class="h-16 w-full bg-muted animate-pulse rounded-2xl"></div>
              <div v-else class="space-y-1">
                <div class="text-3xl font-medium text-foreground tabular-nums tracking-tight">{{ $t('common.currency_usd') }} {{ projectRevenue.usd.toLocaleString(undefined, {minimumFractionDigits: 2}) }}</div>
                <div class="text-[11px] font-medium text-muted-foreground/40 uppercase tracking-tighter">{{ $t('common.currency_khr') }} {{ projectRevenue.khr.toLocaleString() }}</div>
              </div>
            </CardContent>
          </Card>

          <!-- Project Expenses -->
          <Card class="rounded-3xl border-none ring-1 ring-border shadow-sm bg-card overflow-hidden group transition-all">
            <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-3 bg-muted/30">
              <div>
                <p class="text-[9px] font-semibold text-primary/60 uppercase tracking-widest mb-0.5">{{ $t('admin.sidebar.projects') }}</p>
                <CardTitle class="text-[10px] font-medium text-muted-foreground/60 uppercase tracking-wider">{{ $t('admin.expenses') }}</CardTitle>
              </div>
              <div class="h-10 w-10 rounded-xl bg-red-500/10 flex items-center justify-center text-red-500 border border-red-500/20">
                <CreditCardIcon class="h-5 w-5" />
              </div>
            </CardHeader>
            <CardContent class="pt-6">
              <div v-if="loading" class="h-16 w-full bg-muted animate-pulse rounded-2xl"></div>
              <div v-else class="space-y-1">
                <div class="text-3xl font-medium text-rose-500 tabular-nums tracking-tight">{{ $t('common.currency_usd') }} {{ projectExpenses.usd.toLocaleString(undefined, {minimumFractionDigits: 2}) }}</div>
                <div class="text-[11px] font-medium text-muted-foreground/40 uppercase tracking-tighter">{{ $t('common.currency_khr') }} {{ projectExpenses.khr.toLocaleString() }}</div>
              </div>
            </CardContent>
          </Card>

          <!-- Project Balance -->
          <Card class="rounded-3xl border-none ring-1 ring-border shadow-sm bg-card overflow-hidden group transition-all">
            <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-3 bg-muted/30">
              <div>
                <p class="text-[9px] font-semibold text-primary/60 uppercase tracking-widest mb-0.5">{{ $t('admin.sidebar.projects') }}</p>
                <CardTitle class="text-[10px] font-medium text-muted-foreground/60 uppercase tracking-wider">{{ $t('admin.balance') }}</CardTitle>
              </div>
              <div class="h-10 w-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500 border border-blue-500/20">
                <ActivityIcon class="h-5 w-5" />
              </div>
            </CardHeader>
            <CardContent class="pt-6">
              <div v-if="loading" class="h-16 w-full bg-muted animate-pulse rounded-2xl"></div>
              <div v-else class="space-y-1">
                <div class="text-3xl font-medium tabular-nums tracking-tight" :class="projectBalance.usd >= 0 ? 'text-primary' : 'text-rose-500'">{{ $t('common.currency_usd') }} {{ projectBalance.usd.toLocaleString(undefined, {minimumFractionDigits: 2}) }}</div>
                <div class="text-[11px] font-medium text-muted-foreground/40 uppercase tracking-tighter">{{ $t('common.currency_khr') }} {{ projectBalance.khr.toLocaleString() }}</div>
              </div>
            </CardContent>
          </Card>

          <!-- Activity -->
          <Card class="rounded-3xl border-none ring-1 ring-border shadow-sm bg-card overflow-hidden group transition-all">
            <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-3 bg-muted/30">
              <CardTitle class="text-[10px] font-medium text-muted-foreground/60 uppercase tracking-wider">{{ $t('admin.activity') }}</CardTitle>
              <div class="h-10 w-10 rounded-xl bg-violet-500/10 flex items-center justify-center text-violet-500 border border-violet-500/20">
                <FolderIcon class="h-5 w-5" />
              </div>
            </CardHeader>
            <CardContent class="pt-6">
              <div v-if="loading" class="h-16 w-full bg-muted animate-pulse rounded-2xl"></div>
              <div v-else class="flex flex-col gap-2">
                <div class="flex items-baseline gap-2">
                  <span class="text-3xl font-medium text-foreground">{{ activeProjects }}</span>
                  <span class="text-[9px] font-medium text-muted-foreground/40 uppercase tracking-wider">{{ $t('admin.active_projects') }}</span>
                </div>
                <div class="text-[10px] font-semibold text-primary flex items-center gap-2 uppercase tracking-wider bg-primary/5 px-2 py-1 rounded-lg w-fit">
                  <span class="size-1.5 rounded-full bg-primary animate-pulse"></span>
                  {{ totalUsers }} {{ $t('admin.total_users') }}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <!-- Metrics Cards Row 2: Ceremonies -->
        <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <!-- Ceremony Revenue -->
          <Card class="rounded-3xl border-none ring-1 ring-border shadow-sm bg-card overflow-hidden group transition-all">
            <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-3 bg-muted/30">
              <div>
                <p class="text-[9px] font-semibold text-violet-500/70 uppercase tracking-widest mb-0.5">{{ $t('admin.sidebar.ceremonies') }}</p>
                <CardTitle class="text-[10px] font-medium text-muted-foreground/60 uppercase tracking-wider">{{ $t('admin.revenue') }}</CardTitle>
              </div>
              <div class="h-10 w-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500 border border-emerald-500/20">
                <DollarSignIcon class="h-5 w-5" />
              </div>
            </CardHeader>
            <CardContent class="pt-6">
              <div v-if="loading" class="h-16 w-full bg-muted animate-pulse rounded-2xl"></div>
              <div v-else class="space-y-1">
                <div class="text-3xl font-medium text-foreground tabular-nums tracking-tight">{{ $t('common.currency_usd') }} {{ ceremonyRevenue.usd.toLocaleString(undefined, {minimumFractionDigits: 2}) }}</div>
                <div class="text-[11px] font-medium text-muted-foreground/40 uppercase tracking-tighter">{{ $t('common.currency_khr') }} {{ ceremonyRevenue.khr.toLocaleString() }}</div>
              </div>
            </CardContent>
          </Card>

          <!-- Ceremony Expenses -->
          <Card class="rounded-3xl border-none ring-1 ring-border shadow-sm bg-card overflow-hidden group transition-all">
            <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-3 bg-muted/30">
              <div>
                <p class="text-[9px] font-semibold text-violet-500/70 uppercase tracking-widest mb-0.5">{{ $t('admin.sidebar.ceremonies') }}</p>
                <CardTitle class="text-[10px] font-medium text-muted-foreground/60 uppercase tracking-wider">{{ $t('admin.expenses') }}</CardTitle>
              </div>
              <div class="h-10 w-10 rounded-xl bg-red-500/10 flex items-center justify-center text-red-500 border border-red-500/20">
                <CreditCardIcon class="h-5 w-5" />
              </div>
            </CardHeader>
            <CardContent class="pt-6">
              <div v-if="loading" class="h-16 w-full bg-muted animate-pulse rounded-2xl"></div>
              <div v-else class="space-y-1">
                <div class="text-3xl font-medium text-rose-500 tabular-nums tracking-tight">{{ $t('common.currency_usd') }} {{ ceremonyExpensesTotal.usd.toLocaleString(undefined, {minimumFractionDigits: 2}) }}</div>
                <div class="text-[11px] font-medium text-muted-foreground/40 uppercase tracking-tighter">{{ $t('common.currency_khr') }} {{ ceremonyExpensesTotal.khr.toLocaleString() }}</div>
              </div>
            </CardContent>
          </Card>

          <!-- Ceremony Balance -->
          <Card class="rounded-3xl border-none ring-1 ring-border shadow-sm bg-card overflow-hidden group transition-all">
            <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-3 bg-muted/30">
              <div>
                <p class="text-[9px] font-semibold text-violet-500/70 uppercase tracking-widest mb-0.5">{{ $t('admin.sidebar.ceremonies') }}</p>
                <CardTitle class="text-[10px] font-medium text-muted-foreground/60 uppercase tracking-wider">{{ $t('admin.balance') }}</CardTitle>
              </div>
              <div class="h-10 w-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500 border border-blue-500/20">
                <ActivityIcon class="h-5 w-5" />
              </div>
            </CardHeader>
            <CardContent class="pt-6">
              <div v-if="loading" class="h-16 w-full bg-muted animate-pulse rounded-2xl"></div>
              <div v-else class="space-y-1">
                <div class="text-3xl font-medium tabular-nums tracking-tight" :class="ceremonyBalance.usd >= 0 ? 'text-primary' : 'text-rose-500'">{{ $t('common.currency_usd') }} {{ ceremonyBalance.usd.toLocaleString(undefined, {minimumFractionDigits: 2}) }}</div>
                <div class="text-[11px] font-medium text-muted-foreground/40 uppercase tracking-tighter">{{ $t('common.currency_khr') }} {{ ceremonyBalance.khr.toLocaleString() }}</div>
              </div>
            </CardContent>
          </Card>

          <!-- Combined Net Balance -->
          <Card class="rounded-3xl border-none ring-1 ring-border shadow-sm bg-card overflow-hidden group transition-all">
            <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-3 bg-muted/30">
              <CardTitle class="text-[10px] font-medium text-muted-foreground/60 uppercase tracking-wider">{{ $t('admin.balance') }}</CardTitle>
              <div class="h-10 w-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500 border border-blue-500/20">
                <ActivityIcon class="h-5 w-5" />
              </div>
            </CardHeader>
            <CardContent class="pt-6">
              <div v-if="loading" class="h-16 w-full bg-muted animate-pulse rounded-2xl"></div>
              <div v-else class="space-y-1">
                <div class="text-3xl font-medium tabular-nums tracking-tight font-sans text-primary">{{ $t('common.currency_usd') }} {{ netBalance.usd.toLocaleString(undefined, {minimumFractionDigits: 2}) }}</div>
                <div class="text-[11px] font-medium text-muted-foreground/40 uppercase tracking-tighter">{{ $t('common.currency_khr') }} {{ netBalance.khr.toLocaleString() }}</div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
          <!-- Overview Chart -->
          <Card class="col-span-full lg:col-span-4 rounded-3xl border-none ring-1 ring-border bg-card shadow-sm overflow-hidden">
            <CardHeader class="pb-10">
              <CardTitle class="text-2xl font-semibold text-foreground uppercase tracking-tight">{{ $t('admin.revenue_trend') }}</CardTitle>
              <CardDescription class="font-medium text-muted-foreground">{{ $t('admin.revenue_trend_subtitle') }}</CardDescription>
            </CardHeader>
            <CardContent class="pb-8 overflow-hidden">
               <div class="h-[400px] w-full negative-margin-x">
                 <div>
                   <apexchart 
                     v-if="revenueTrendSeries[0].data.length > 0"
                     type="area" 
                     height="400" 
                     :options="revenueTrendOptions" 
                     :series="revenueTrendSeries" 
                   />
                   <div v-else class="h-full flex flex-col items-center justify-center text-muted-foreground/30 gap-4">
                        <RefreshCwIcon class="size-10 animate-spin opacity-20" />
                        <span class="text-xs font-semibold uppercase tracking-widest">{{ $t('admin.analytics_labels.loading_data') }}</span>
                   </div>
                 </div>
               </div>
            </CardContent>
          </Card>
          
          <!-- Recent Sales (Donations) -->
          <Card class="col-span-full lg:col-span-3 rounded-3xl border-none ring-1 ring-border bg-muted/20 shadow-sm overflow-hidden flex flex-col">
            <CardHeader class="pb-8 pt-8">
              <div class="flex items-center justify-between">
                <div>
                  <CardTitle class="text-2xl font-semibold text-foreground uppercase tracking-tight">{{ $t('admin.recent_donors') }}</CardTitle>
                  <CardDescription class="mt-1 font-medium text-muted-foreground">
                    {{ $t('admin.recent_donors_subtitle') }}
                  </CardDescription>
                </div>
                <div class="size-12 rounded-2xl bg-card border border-border flex items-center justify-center shadow-lg shadow-black/5 ring-1 ring-border/5">
                    <UsersIcon class="size-6 text-primary" />
                </div>
              </div>
            </CardHeader>
            <CardContent class="flex-1 px-4">
              <div class="space-y-3">
                 <div v-for="(d, i) in recentDonations" :key="i" class="flex items-center gap-4 p-4 rounded-2xl bg-card border border-border/50 shadow-sm hover:shadow-xl hover:-translate-y-0.5 transition-all group ring-1 ring-border/5">
                    <Avatar class="h-12 w-12 rounded-xl ring-2 ring-background border border-border shadow-inner">
                       <AvatarImage :src="d.avatar" alt="Avatar" />
                       <AvatarFallback class="text-xs font-semibold bg-muted text-muted-foreground/60 uppercase tracking-widest">{{ d.initials }}</AvatarFallback>
                    </Avatar>
                    <div class="flex-1 min-w-0 flex flex-col text-left">
                       <p class="text-sm font-semibold text-foreground truncate tracking-tight font-khmer">{{ d.donorName }}</p>
                       <p class="text-[9px] text-muted-foreground/60 font-semibold uppercase tracking-widest mt-0.5 italic">{{ d.paymentMethod || 'CASH' }}</p>
                    </div>
                    <div class="text-right">
                       <div class="text-lg font-semibold tabular-nums tracking-tighter" :class="Number(d.amount) > 0 ? 'text-emerald-500' : 'text-rose-500'">
                          <span class="text-[10px] font-semibold mr-1 opacity-60">{{ d.currency === 'KHR' ? $t('common.currency_khr') : '$' }}</span>{{ Number(d.amount).toLocaleString() }}
                       </div>
                       <div class="text-[9px] text-muted-foreground/30 font-semibold tabular-nums uppercase tracking-widest italic">{{ formatDateShort(d.createdAt) }}</div>
                    </div>
                 </div>
                 
                 <!-- Empty State -->
                 <div v-if="recentDonations.length === 0" class="flex flex-col items-center justify-center py-20 text-muted-foreground/20 gap-4">
                    <div class="size-20 rounded-full bg-card border-2 border-dashed border-border flex items-center justify-center">
                      <FolderOpenIcon class="h-10 w-10" />
                    </div>
                    <span class="text-[10px] font-semibold uppercase tracking-[0.3em]">{{ $t('admin.no_donations') }}</span>
                 </div>
              </div>
            </CardContent>
            <CardFooter class="p-6 pt-2">
                <Button variant="ghost" class="w-full rounded-2xl border border-border/50 bg-card text-muted-foreground font-semibold text-[10px] uppercase tracking-widest h-14 hover:bg-muted hover:text-primary transition-all shadow-sm">
                    {{ $t('admin.show_more') }}
                </Button>
            </CardFooter>
          </Card>
        </div>
      </TabsContent>
      
      <!-- Analytics Tab -->
      <TabsContent value="analytics" class="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div class="grid gap-6 md:grid-cols-2">
          <!-- Expenses by Category (Pie Chart) -->
          <Card class="rounded-3xl border-none ring-1 ring-border bg-card shadow-sm overflow-hidden">
            <CardHeader class="border-b border-border bg-muted/30">
              <CardTitle class="text-lg font-semibold text-foreground uppercase tracking-tight font-khmer">{{ $t('admin.analytics_labels.expenses_by_category') }}</CardTitle>
              <CardDescription class="font-medium text-muted-foreground">{{ $t('admin.analytics_labels.expenses_by_category_subtitle') }}</CardDescription>
            </CardHeader>
            <CardContent class="h-[400px] pt-10">
              <div>
                <apexchart 
                  v-if="expenseSeries.length > 0"
                  type="pie" 
                  height="350" 
                  :options="expensePieOptions" 
                  :series="expenseSeries" 
                />
                <div v-else class="h-full flex flex-col items-center justify-center text-muted-foreground/20 gap-4">
                    <PieChartIcon class="size-16 opacity-10" />
                    <span class="text-xs font-semibold uppercase tracking-widest">{{ $t('admin.analytics_labels.no_expense_data') }}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <!-- Donation Methods (Doughnut Chart) -->
          <Card class="rounded-3xl border-none ring-1 ring-border bg-card shadow-sm overflow-hidden">
            <CardHeader class="border-b border-border bg-muted/30">
              <CardTitle class="text-lg font-semibold text-foreground uppercase tracking-tight font-khmer">{{ $t('admin.analytics_labels.donation_methods') }}</CardTitle>
              <CardDescription class="font-medium text-muted-foreground">{{ $t('admin.analytics_labels.donation_methods_subtitle') }}</CardDescription>
            </CardHeader>
            <CardContent class="h-[400px] pt-10">
              <div>
                <apexchart 
                  v-if="methodSeries.length > 0"
                  type="donut" 
                  height="350" 
                  :options="methodDonutOptions" 
                  :series="methodSeries" 
                />
                <div v-else class="h-full flex flex-col items-center justify-center text-muted-foreground/20 gap-4">
                    <ActivityIcon class="size-16 opacity-10" />
                    <span class="text-xs font-semibold uppercase tracking-widest">{{ $t('admin.analytics_labels.no_donation_data') }}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <!-- Monthly Trends -->
        <Card class="rounded-3xl border-none ring-1 ring-border bg-card shadow-sm overflow-hidden">
          <CardHeader class="border-b border-border bg-muted/30 pb-4">
            <CardTitle class="text-lg font-semibold text-foreground uppercase tracking-tight font-khmer">{{ $t('admin.analytics_labels.monthly_trend') }} (USD)</CardTitle>
            <CardDescription class="font-medium text-muted-foreground">{{ $t('admin.analytics_labels.monthly_trend_subtitle') }}</CardDescription>
          </CardHeader>
          <CardContent class="h-[450px] pt-10 overflow-hidden">
            <div>
              <apexchart 
                v-if="trendSeries[0].data.some(v => v > 0) || trendSeries[1].data.some(v => v > 0)"
                type="line" 
                height="400" 
                :options="trendOptions" 
                :series="trendSeries" 
              />
              <div v-else class="h-full flex flex-col items-center justify-center text-muted-foreground/20 gap-4">
                    <ActivityIcon class="size-16 opacity-10" />
                    <span class="text-xs font-semibold uppercase tracking-widest">{{ $t('admin.analytics_labels.loading_data') }}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
      
      <!-- Reports Tab -->
      <TabsContent value="reports" class="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div class="grid gap-8 md:grid-cols-2 lg:grid-cols-3 text-left">
          <Card v-for="report in reportTypes" :key="report.id" class="rounded-3xl border-none ring-1 ring-border bg-card overflow-hidden hover:shadow-2xl transition-all group flex flex-col">
            <CardHeader class="p-8 flex-1">
              <div class="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-6 transition-transform group-hover:scale-110 group-hover:rotate-3 border border-primary/20">
                <component :is="report.icon" class="h-8 w-8" />
              </div>
              <CardTitle class="text-xl font-semibold text-foreground uppercase tracking-tight font-khmer">{{ $t(`admin.reports_list.${report.id}`) }}</CardTitle>
              <CardDescription class="text-sm font-medium text-muted-foreground mt-2 leading-relaxed">{{ $t(`admin.reports_list.${report.id}_desc`) }}</CardDescription>
            </CardHeader>
            <CardFooter class="p-4 pt-0">
              <Button variant="ghost" class="w-full h-14 rounded-2xl justify-between group px-6 bg-muted/30 font-semibold uppercase tracking-widest text-[10px] hover:bg-primary/10 hover:text-primary transition-all shadow-sm" @click="handleExport(report.id)">
                <span>Download CSV Report</span>
                <DownloadIcon class="h-4 w-4 transition-transform group-hover:translate-y-1" />
              </Button>
            </CardFooter>
          </Card>
        </div>
      </TabsContent>
    </Tabs>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useColorMode } from '@vueuse/core'
import { format } from 'date-fns'

import {
  CalendarIcon,
  DownloadIcon,
  DollarSignIcon,
  CreditCardIcon,
  ActivityIcon,
  FolderIcon,
  PieChartIcon,
  FileBarChartIcon,
  ClipboardListIcon,
  RefreshCwIcon,
  UsersIcon,
  FolderOpenIcon
} from 'lucide-vue-next'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useDonations } from '~/composables/useDonations'
import { useExpenses } from '~/composables/useExpenses'
import { useProjects } from '~/composables/useProjects'
import { useCeremonyFinance } from '~/composables/useCeremonyFinance'
import { useUsers } from '~/composables/useUsers'
import { useKhrRate } from '~/composables/useKhrRate'

const { khrRate } = useKhrRate()
const { fetchTotalUsersCount } = useUsers()
const { donations, fetchAllDonations, loading: loadingDonations } = useDonations()
const { expenses, fetchAllExpenses, loading: loadingExpenses } = useExpenses()
const { projects, fetchProjects, loading: loadingProjects, recalculateProjectProgress } = useProjects()
const {
  incomes: ceremonyIncomes,
  expenses: ceremonyExpenses,
  fetchAllIncomes: fetchAllCeremonyIncomes,
  fetchAllExpenses: fetchAllCeremonyExpenses,
  loading: loadingCeremonyFinance
} = useCeremonyFinance()

const colorMode = useColorMode()
const isDark = computed(() => colorMode.value === 'dark')

const totalUsers = ref(0)
const loadingUsers = ref(false)
const fetchTotalUsers = async () => {
    loadingUsers.value = true
    try {
        const count = await fetchTotalUsersCount()
        totalUsers.value = count
    } catch (e) {
        console.error(e)
    } finally {
        loadingUsers.value = false
    }
}

const loading = computed(() => loadingDonations.value || loadingExpenses.value || loadingProjects.value || loadingCeremonyFinance.value)

const recalculatingAll = ref(false)
const recalculateAll = async () => {
    recalculatingAll.value = true
    try {
        for (const p of projects.value) {
            if (p.id) await recalculateProjectProgress(p.id)
        }
    } catch (err) {
        console.error(err)
    } finally {
        recalculatingAll.value = false
    }
}

// --- Project-only metrics ---
const projectRevenue = computed(() => ({
    usd: donations.value.filter(d => d.currency !== 'KHR').reduce((sum, d) => sum + (Number(d.amount) || 0), 0),
    khr: donations.value.filter(d => d.currency === 'KHR').reduce((sum, d) => sum + (Number(d.amount) || 0), 0)
}))

const projectExpenses = computed(() => ({
    usd: expenses.value.filter(e => (e as any).currency !== 'KHR').reduce((sum, e) => sum + (Number(e.amount) || 0), 0),
    khr: expenses.value.filter(e => (e as any).currency === 'KHR').reduce((sum, e) => sum + (Number(e.amount) || 0), 0)
}))

const projectBalance = computed(() => ({
    usd: projectRevenue.value.usd - projectExpenses.value.usd,
    khr: projectRevenue.value.khr - projectExpenses.value.khr
}))

// --- Ceremony-only metrics ---
const ceremonyRevenue = computed(() => ({
    usd: ceremonyIncomes.value.filter(i => i.currency !== 'KHR').reduce((sum, i) => sum + (Number(i.amount) || 0), 0),
    khr: ceremonyIncomes.value.filter(i => i.currency === 'KHR').reduce((sum, i) => sum + (Number(i.amount) || 0), 0)
}))

const ceremonyExpensesTotal = computed(() => ({
    usd: ceremonyExpenses.value.filter(e => e.currency !== 'KHR').reduce((sum, e) => sum + (Number(e.amount) || 0), 0),
    khr: ceremonyExpenses.value.filter(e => e.currency === 'KHR').reduce((sum, e) => sum + (Number(e.amount) || 0), 0)
}))

const ceremonyBalance = computed(() => ({
    usd: ceremonyRevenue.value.usd - ceremonyExpensesTotal.value.usd,
    khr: ceremonyRevenue.value.khr - ceremonyExpensesTotal.value.khr
}))

// Keep combined for charts
const totalRevenue = computed(() => ({
    usd: projectRevenue.value.usd + ceremonyRevenue.value.usd,
    khr: projectRevenue.value.khr + ceremonyRevenue.value.khr
}))
const totalExpenses = computed(() => ({
    usd: projectExpenses.value.usd + ceremonyExpensesTotal.value.usd,
    khr: projectExpenses.value.khr + ceremonyExpensesTotal.value.khr
}))
const netBalance = computed(() => ({
    usd: totalRevenue.value.usd - totalExpenses.value.usd,
    khr: totalRevenue.value.khr - totalExpenses.value.khr
}))

const activeProjects = computed(() => {
    return projects.value.filter(p => p.status === 'active').length
})

// Recent Donations (Last 5)
const recentDonations = computed(() => {
    const sorted = [...donations.value].sort((a, b) => {
        const dateA = a.createdAt?.toDate ? a.createdAt.toDate() : new Date(a.createdAt || 0)
        const dateB = b.createdAt?.toDate ? b.createdAt.toDate() : new Date(b.createdAt || 0)
        return dateB.getTime() - dateA.getTime()
    })
    return sorted.slice(0, 5).map(d => ({
        ...d,
        avatar: '', 
        initials: (d.donorName || 'A').charAt(0).toUpperCase()
    }))
})

const formatDateShort = (date: any) => {
    if (!date) return ''
    const d = date.toDate ? date.toDate() : new Date(date)
    return format(d, 'dd/MM/yy')
}

// --- ApexCharts Configuration ---

const monthLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

// 1. Revenue Trend (Area Chart) — projects + ceremonies combined
const revenueTrendSeries = computed(() => {
  const data = new Array(12).fill(0)
  donations.value.forEach(d => {
    const date = d.createdAt?.toDate ? d.createdAt.toDate() : new Date(d.createdAt || Date.now())
    const month = date.getMonth()
    const amount = Number(d.amount) || 0
    data[month] += d.currency === 'KHR' ? amount / khrRate.value : amount
  })
  ceremonyIncomes.value.forEach(i => {
    const date = (i.createdAt as any)?.toDate ? (i.createdAt as any).toDate() : new Date((i.createdAt as any) || Date.now())
    const month = date.getMonth()
    const amount = Number(i.amount) || 0
    data[month] += i.currency === 'KHR' ? amount / khrRate.value : amount
  })
  return [{ name: 'Revenue', data }]
})

const revenueTrendOptions = computed(() => ({
  chart: {
    toolbar: { show: false },
    zoom: { enabled: false },
    fontFamily: 'Inter, sans-serif',
    background: 'transparent'
  },
  theme: { mode: isDark.value ? 'dark' : 'light' },
  colors: ['#ea580c'],
  dataLabels: { enabled: false },
  stroke: { curve: 'smooth', width: 4 },
  fill: {
    type: 'gradient',
    gradient: {
      shadeIntensity: 1,
      opacityFrom: 0.5,
      opacityTo: 0,
      stops: [0, 95]
    }
  },
  xaxis: {
    categories: monthLabels,
    axisBorder: { show: false },
    axisTicks: { show: false },
    labels: { style: { colors: isDark.value ? '#94a3b8' : '#64748b', fontWeight: 700, fontSize: '10px' } }
  },
  yaxis: {
    labels: {
      style: { colors: isDark.value ? '#94a3b8' : '#64748b', fontWeight: 700, fontSize: '10px' },
      formatter: (val: number) => `$${val.toLocaleString()}`
    }
  },
  grid: {
    borderColor: isDark.value ? '#1e293b' : '#f1f5f9',
    strokeDashArray: 5,
    padding: { left: 10, right: 10 }
  },
  tooltip: {
    theme: 'dark',
    y: { formatter: (val: number) => `$${val.toLocaleString(undefined, { minimumFractionDigits: 2 })}` }
  },
  markers: {
    size: 5,
    colors: ['#ea580c'],
    strokeColors: '#fff',
    strokeWidth: 3,
    hover: { size: 7 }
  }
}))

// 2. Expenses by Category (Pie)
const expenseSeries = computed(() => {
  const categories: Record<string, number> = {}
  expenses.value.forEach(e => {
    const cat = e.category || 'Other'
    const amount = Number(e.amount) || 0
    const val = (e as any).currency === 'KHR' ? amount / khrRate.value : amount
    categories[cat] = (categories[cat] || 0) + val
  })
  return Object.values(categories)
})

const expensePieOptions = computed(() => {
  const categories: Record<string, number> = {}
  expenses.value.forEach(e => {
    const cat = e.category || 'Other'
    categories[cat] = (categories[cat] || 0) + 1
  })
  return {
    labels: Object.keys(categories),
    theme: { mode: isDark.value ? 'dark' : 'light' },
    chart: { background: 'transparent' },
    colors: ['#f97316', '#fb923c', '#fdba74', '#fed7aa', '#ffedd5'],
    legend: { position: 'bottom', labels: { colors: isDark.value ? '#94a3b8' : '#64748b' } },
    dataLabels: { enabled: true, dropShadow: { enabled: false } },
    stroke: { width: 0 }
  }
})

// 3. Donation Methods (Donut)
const methodSeries = computed(() => {
  const methods: Record<string, number> = {}
  donations.value.forEach(d => {
    const method = d.paymentMethod || 'cash'
    methods[method] = (methods[method] || 0) + 1
  })
  return Object.values(methods)
})

const methodDonutOptions = computed(() => {
  const methods: Record<string, number> = {}
  donations.value.forEach(d => {
    const method = (d.paymentMethod || 'cash').toUpperCase()
    methods[method] = (methods[method] || 0) + 1
  })
  return {
    labels: Object.keys(methods),
    theme: { mode: isDark.value ? 'dark' : 'light' },
    chart: { background: 'transparent' },
    colors: ['#0f172a', '#334155', '#64748b', '#94a3b8', '#cbd5e1'],
    plotOptions: {
      pie: {
        donut: {
          size: '80%',
          labels: {
            show: true,
            total: {
              show: true,
              label: 'Total',
              formatter: () => donations.value.length,
              color: isDark.value ? '#94a3b8' : '#64748b'
            },
            name: { color: isDark.value ? '#94a3b8' : '#64748b' },
            value: { color: isDark.value ? '#f8fafc' : '#0f172a', fontWeight: 800 }
          }
        }
      }
    },
    legend: { position: 'bottom', labels: { colors: isDark.value ? '#94a3b8' : '#64748b' } },
    stroke: { width: 0 }
  }
})

// 4. Trend Line Chart — projects + ceremonies combined
const trendSeries = computed(() => {
  const incomeData = new Array(12).fill(0)
  const expenseData = new Array(12).fill(0)

  donations.value.forEach(d => {
    const month = (d.createdAt?.toDate ? d.createdAt.toDate() : new Date(d.createdAt || Date.now())).getMonth()
    incomeData[month] += d.currency === 'KHR' ? Number(d.amount) / khrRate.value : Number(d.amount)
  })
  ceremonyIncomes.value.forEach(i => {
    const month = ((i.createdAt as any)?.toDate ? (i.createdAt as any).toDate() : new Date((i.createdAt as any) || Date.now())).getMonth()
    incomeData[month] += i.currency === 'KHR' ? Number(i.amount) / khrRate.value : Number(i.amount)
  })

  expenses.value.forEach(e => {
    const month = (e.createdAt?.toDate ? e.createdAt.toDate() : new Date(e.createdAt || Date.now())).getMonth()
    expenseData[month] += (e as any).currency === 'KHR' ? Number(e.amount) / khrRate.value : Number(e.amount)
  })
  ceremonyExpenses.value.forEach(e => {
    const month = ((e.createdAt as any)?.toDate ? (e.createdAt as any).toDate() : new Date((e.createdAt as any) || Date.now())).getMonth()
    expenseData[month] += e.currency === 'KHR' ? Number(e.amount) / khrRate.value : Number(e.amount)
  })

  return [
    { name: 'Income', data: incomeData },
    { name: 'Expense', data: expenseData }
  ]
})

const trendOptions = computed(() => ({
  chart: {
    toolbar: { show: false },
    fontFamily: 'Inter, sans-serif',
    background: 'transparent'
  },
  theme: { mode: isDark.value ? 'dark' : 'light' },
  colors: ['#10b981', '#ef4444'],
  stroke: { curve: 'smooth', width: 4 },
  xaxis: { 
      categories: monthLabels,
      labels: { style: { colors: isDark.value ? '#94a3b8' : '#64748b', fontWeight: 700, fontSize: '10px' } }
  },
  yaxis: {
    labels: { 
        style: { colors: isDark.value ? '#94a3b8' : '#64748b', fontWeight: 700, fontSize: '10px' },
        formatter: (val: number) => `$${val.toLocaleString()}` 
    }
  },
  tooltip: {
    theme: 'dark',
    y: { formatter: (val: number) => `$${val.toLocaleString()}` }
  },
  grid: { 
      borderColor: isDark.value ? '#1e293b' : '#f1f5f9',
      strokeDashArray: 5
  },
  legend: { 
      position: 'top', 
      labels: { colors: isDark.value ? '#94a3b8' : '#64748b' } 
  },
  markers: {
    size: 4,
    strokeWidth: 2,
    hover: { size: 6 }
  }
}))

// Reports Configuration
const reportTypes = [
  { id: 'financial_summary', icon: FileBarChartIcon },
  { id: 'donation_list', icon: ClipboardListIcon },
  { id: 'expense_audit', icon: PieChartIcon },
]

const handleExport = (id: string) => {
  let headers: string[] = []
  let rows: any[][] = []
  let filename = `report-${id}-${new Date().toISOString().split('T')[0]}`

  if (id === 'donation_list') {
    headers = ['Date', 'Donor Name', 'Amount', 'Currency', 'Method', 'Type', 'Project ID']
    rows = donations.value.map(d => {
      const date = d.createdAt?.toDate ? d.createdAt.toDate() : new Date(d.createdAt || Date.now())
      return [
        date.toISOString().split('T')[0],
        d.donorName,
        d.amount,
        d.currency,
        d.paymentMethod,
        (d as any).type || 'cash',
        (d as any).projectId || 'N/A'
      ]
    })
  } else if (id === 'expense_audit') {
    headers = ['Date', 'Title', 'Amount', 'Currency', 'Category', 'Payee', 'Project ID']
    rows = expenses.value.map(e => {
      const date = e.createdAt?.toDate ? e.createdAt.toDate() : new Date(e.createdAt || Date.now())
      return [
        date.toISOString().split('T')[0],
        e.title,
        e.amount,
        (e as any).currency || 'USD',
        e.category,
        (e as any).payeeName || 'N/A',
        (e as any).projectId || 'N/A'
      ]
    })
  } else if (id === 'financial_summary') {
    headers = ['Category', 'USD Amount', 'KHR Amount']
    rows = [
      ['Total Revenue', totalRevenue.value.usd, totalRevenue.value.khr],
      ['Total Expenses', totalExpenses.value.usd, totalExpenses.value.khr],
      ['Net Balance', netBalance.value.usd, netBalance.value.khr]
    ]
  }

  if (rows.length === 0 && id !== 'financial_summary') {
    alert('No data available for this report.')
    return
  }

  const csvContent = "\uFEFF" // UTF-8 BOM for Excel Khmer support
    + headers.join(",") + "\n" 
    + rows.map(r => r.map((cell: any) => `"${String(cell).replace(/"/g, '""')}"`).join(",")).join("\n")

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement("a")
  const url = URL.createObjectURL(blob)
  link.setAttribute("href", url)
  link.setAttribute("download", `${filename}.csv`)
  link.style.visibility = 'hidden'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

onMounted(() => {
    fetchAllDonations()
    fetchAllExpenses()
    fetchProjects()
    fetchTotalUsers()
    fetchAllCeremonyIncomes()
    fetchAllCeremonyExpenses()
})
</script>

<style scoped>
.negative-margin-x {
    margin-left: -15px;
    margin-right: -15px;
}
</style>

<route lang="yaml">
meta:
  layout: admin
</route>
