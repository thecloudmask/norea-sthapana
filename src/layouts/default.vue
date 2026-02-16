<template>
  <div class="relative flex min-h-screen flex-col bg-background transition-colors duration-500">
    <Navbar />
    <main class="flex-1">
      <RouterView />
    </main>
    <footer id="contact-footer" class="bg-card text-muted-foreground font-khmer pt-10 md:pt-16 pb-8 border-t border-border mt-auto relative overflow-hidden">
      <!-- Decorator -->
      <div class="absolute top-0 left-0 w-full h-1 bg-primary/10"></div>
      
      <div class="container mx-auto px-6 md:px-4 relative z-10 text-left">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12 lg:gap-16 mb-12">
          
          <!-- Brand Column -->
          <div class="flex flex-col items-start text-left w-full space-y-6">
            <div class="flex items-center gap-4 transition-transform hover:scale-[1.02] cursor-default bg-card">
              <div class="h-12 w-12 rounded-2xl bg-primary flex items-center justify-center shadow-xl shadow-primary/20 shrink-0">
                <span class="text-white font-black text-2xl">{{ $t('app.name_highlight')[0] }}</span>
              </div>
              <div class="flex flex-col text-left">
                <span class="text-2xl font-black text-foreground leading-none">
                  <span class="text-primary">{{ $t('app.name_highlight') }}</span>{{ $t('app.name_rest') }}
                </span>
                <span class="text-[10px] uppercase font-black tracking-[0.2em] text-muted-foreground/40 mt-1.5">{{ $t('app.subtitle') }}</span>
              </div>
            </div>
            <p class="text-sm leading-relaxed text-muted-foreground font-medium max-w-sm text-left">
              {{ $t('footer.description') }}
            </p>
            <div class="flex gap-4">
              <a href="#" class="h-12 w-12 rounded-2xl bg-muted/50 flex items-center justify-center hover:bg-primary hover:text-white transition-all border border-border/50 group">
                <FacebookIcon class="h-5 w-5 transition-transform group-hover:scale-110" />
              </a>
              <a href="#" class="h-12 w-12 rounded-2xl bg-muted/50 flex items-center justify-center hover:bg-primary hover:text-white transition-all border border-border/50 group">
                <SendIcon class="h-5 w-5 transition-transform group-hover:scale-110" />
              </a>
              <a href="#" class="h-12 w-12 rounded-2xl bg-muted/50 flex items-center justify-center hover:bg-primary hover:text-white transition-all border border-border/50 group">
                <YoutubeIcon class="h-5 w-5 transition-transform group-hover:scale-110" />
              </a>
            </div>
          </div>

          <!-- Quick Links -->
          <div class="flex flex-col items-start text-left w-full border-b border-border/40 md:border-none pb-4 md:pb-0">
            <h3 class="text-foreground font-black text-lg uppercase tracking-widest text-[11px] md:cursor-default mb-4 md:mb-6">
              {{ $t('footer.links_title') }}
            </h3>
            <ul class="space-y-4 text-xs font-black uppercase tracking-widest w-full">
              <li>
                <RouterLink to="/" class="hover:text-primary transition-all flex items-center gap-3 group w-full">
                  <span class="h-1.5 w-1.5 rounded-full bg-primary/40 group-hover:bg-primary group-hover:shadow-[0_0_8px_rgba(249,158,26,0.5)] transition-all shrink-0"></span> {{ $t('nav.home') }}
                </RouterLink>
              </li>
               <li>
                 <RouterLink to="/#projects-section" class="hover:text-primary transition-all flex items-center gap-3 group w-full">
                   <span class="h-1.5 w-1.5 rounded-full bg-primary/40 group-hover:bg-primary group-hover:shadow-[0_0_8px_rgba(249,158,26,0.5)] transition-all shrink-0"></span> {{ $t('nav.projects') }}
                 </RouterLink>
              </li>
              <li>
                <RouterLink to="/ceremonies" class="hover:text-primary transition-all flex items-center gap-3 group w-full">
                  <span class="h-1.5 w-1.5 rounded-full bg-primary/40 group-hover:bg-primary group-hover:shadow-[0_0_8px_rgba(249,158,26,0.5)] transition-all shrink-0"></span> {{ $t('nav.ceremonies') }}
                </RouterLink>
              </li>
              <li>
                <RouterLink to="/news" class="hover:text-primary transition-all flex items-center gap-3 group w-full">
                  <span class="h-1.5 w-1.5 rounded-full bg-primary/40 group-hover:bg-primary group-hover:shadow-[0_0_8px_rgba(249,158,26,0.5)] transition-all shrink-0"></span> {{ $t('nav.news') }}
                </RouterLink>
              </li>
              <li>
                <RouterLink to="/articles" class="hover:text-primary transition-all flex items-center gap-3 group w-full">
                  <span class="h-1.5 w-1.5 rounded-full bg-primary/40 group-hover:bg-primary group-hover:shadow-[0_0_8px_rgba(249,158,26,0.5)] transition-all shrink-0"></span> {{ $t('nav.library') }}
                </RouterLink>
              </li>
            </ul>
          </div>

          <!-- Contact Info -->
          <div class="flex flex-col items-start text-left w-full border-b border-border/40 md:border-none pb-4 md:pb-0">
            <h3 class="text-foreground font-black text-lg uppercase tracking-widest text-[11px] md:cursor-default mb-4 md:mb-6">
              {{ $t('footer.contact_title') }}
            </h3>
            <ul class="space-y-4 text-sm font-medium w-full">
              <li class="flex items-start gap-4 justify-start w-full">
                <div class="h-9 w-9 shrink-0 rounded-lg bg-muted/50 flex items-center justify-center text-primary border border-border/50">
                    <MapPinIcon class="h-4 w-4" />
                </div>
                <span class="text-foreground/70 leading-relaxed text-left text-xs">{{ $t('footer.address') }}</span>
              </li>
              <li class="flex items-center gap-4 justify-start w-full">
                <a href="tel:+85592790790" class="flex items-center gap-4 group w-full">
                    <div class="h-9 w-9 shrink-0 rounded-lg bg-muted/50 flex items-center justify-center text-primary border border-border/50 group-hover:bg-primary group-hover:text-white transition-all">
                        <PhoneIcon class="h-4 w-4" />
                    </div>
                    <span class="text-foreground/70 font-bold tabular-nums group-hover:text-primary transition-colors text-xs">092 790 790</span>
                </a>
              </li>
              <li class="flex items-center gap-4 justify-start w-full">
                <a href="mailto:info@nareasthapana.com" class="flex items-center gap-4 group w-full">
                    <div class="h-9 w-9 shrink-0 rounded-lg bg-muted/50 flex items-center justify-center text-primary border border-border/50 group-hover:bg-primary group-hover:text-white transition-all">
                        <MailIcon class="h-4 w-4" />
                    </div>
                    <span class="text-foreground/70 font-bold group-hover:text-primary transition-colors text-xs truncate">info@nareasthapana.com</span>
                </a>
              </li>
            </ul>
          </div>

          <!-- Map -->
          <div class="flex flex-col items-start text-left w-full space-y-4 md:space-y-6">
            <h3 class="text-foreground font-black text-lg uppercase tracking-widest text-[11px] md:cursor-default">
              {{ $t('footer.location') }}
            </h3>
            
            <div class="w-full mt-4 md:mt-6">
              <div class="relative group aspect-[1.5] w-full rounded-3xl overflow-hidden border border-border bg-muted shadow-2xl transition-all hover:ring-2 hover:ring-primary/20">
                <iframe 
                  src="https://maps.google.com/maps?q=Wat%20Norea%20Thibdei&t=&z=14&ie=UTF8&iwloc=&output=embed"
                  width="100%" 
                  height="100%" 
                  style="border:0;" 
                  allowfullscreen="true" 
                  loading="lazy" 
                  referrerpolicy="no-referrer-when-downgrade"
                  class="transition-all duration-700 opacity-100"
                ></iframe>
                
                <!-- Custom Google Maps Style Card Overlay -->
                <div class="absolute top-4 left-4 right-4 bg-background/90 backdrop-blur-md p-4 rounded-2xl shadow-2xl z-10 opacity-0 group-hover:opacity-100 transition-all duration-500 transform -translate-y-2 group-hover:translate-y-0 pointer-events-none md:pointer-events-auto border border-border">
                    <div class="flex justify-between items-start gap-3">
                      <div class="text-left">
                        <h4 class="font-black text-foreground text-xs font-khmer">{{ $t('common.temple_name') }}</h4>
                        <p class="text-[10px] font-medium text-muted-foreground mt-1">{{ $t('footer.battambang_cambodia') }}</p>
                      </div>
                      <div class="h-10 w-10 bg-primary/10 rounded-xl flex items-center justify-center shrink-0 border border-primary/20">
                        <MapPinIcon class="h-5 w-5 text-primary" />
                      </div>
                    </div>
                    <div class="flex items-center gap-2 mt-2">
                       <span class="text-orange-500 text-[10px] tracking-tighter">★★★★★</span>
                       <span class="text-[10px] font-black text-muted-foreground/60">{{ $t('footer.reviews', { n: 48 }) }}</span>
                    </div>
                    <a 
                      href="https://maps.app.goo.gl/G6qMVQ1bvfLs2e9PA" 
                      target="_blank" 
                      class="text-primary text-[10px] mt-3 block hover:opacity-70 font-black uppercase tracking-widest"
                    >
                      {{ $t('footer.view_larger_map') }} &rarr;
                    </a>
                </div>
              </div>
            </div>
          </div>

        </div>

        <!-- Copyright -->
        <div class="pt-8 md:pt-10 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4 md:gap-6 text-xs font-black uppercase tracking-widest text-muted-foreground/40 italic text-center md:text-left">
          <p>&copy; {{ new Date().getFullYear() }} {{ $t('app.name') }}. {{ $t('footer.copyright') }}</p>
          <div class="flex flex-wrap justify-center md:justify-end gap-6 md:gap-8">
            <RouterLink to="/privacy-policy" class="hover:text-primary transition-colors">{{ $t('footer.privacy_policy') }}</RouterLink>
            <RouterLink to="/terms-of-use" class="hover:text-primary transition-colors">{{ $t('footer.terms_of_use') }}</RouterLink>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { FacebookIcon, SendIcon, YoutubeIcon, MapPinIcon, PhoneIcon, MailIcon } from 'lucide-vue-next'


</script>
