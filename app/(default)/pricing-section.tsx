import Image from 'next/image'
import Illustration from '@/public/images/page-illustration.svg'
import Pricing from '@/components/pricing'
import { linkClassName } from "@/components/utils/linkClassName";

export default function PricingSection() {
  return (
    <section className="relative" id="pricing">
      {/* Radial gradient */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10" aria-hidden="true">
        <div className="absolute flex items-center justify-center top-0 -translate-y-3/4 left-1/2 -translate-x-1/2 w-1/3 aspect-square">
          <div className="absolute inset-0 translate-z-0 bg-purple-500 rounded-full blur-[70px] opacity-50" />
        </div>
      </div>
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="py-12 md:py-20">
          {/* Content */}
          <div className="max-w-3xl mx-auto text-center pb-5 md:pb-8">
            <div>
              <div className="inline-flex font-medium bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-purple-200 pb-3">Pricing</div>
            </div>
            <h2 className="h2 bg-clip-text text-transparent bg-gradient-to-r from-slate-200/60 via-slate-200 to-slate-200/60 pb-4">Free and Open source software</h2>
            <p className="text-lg text-slate-400">
              It's <a 
                target="_blank" 
                href="https://github.com/keycloakify/oidc-spa?tab=MIT-1-ov-file#readme"
                className={linkClassName}
              >an MIT licensed</a>&nbsp;
              open source project.<br/>
              You can use it in your commercial projects without any restrictions.
            </p>
          </div>
          {/*<Pricing />*/}
        </div>
      </div>

    </section>
  )
}
