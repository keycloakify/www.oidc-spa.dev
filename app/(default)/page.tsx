export const metadata = {
  title: 'OIDC SPA',
  description: 'Openid connect client for Single Page Applications',
}

import Hero from '@/components/hero'
import Clients from '@/components/clients'
import Features from '@/components/features'
import Features02 from '@/components/features-02'
import Features03 from '@/components/features-03'
import TestimonialsCarousel from '@/components/testimonials-carousel'
import Features04 from '@/components/features-04'
import Pricing from './pricing-section'
import Testimonials from '@/components/testimonials'
import Cta from '@/components/cta'
import Sponsors from '@/components/sponsors'

export default function Home() {
  return (
    <>
      <Hero />
      <Features02 />
      <Features03 />
      {/*<Clients />*/}
      {/*<Features />*/}
      {/*<Features04 />*/}
      <Pricing />
      <Testimonials />
      <TestimonialsCarousel />
      {/*<Cta />*/}
      <Sponsors />
    </>
  )
}
