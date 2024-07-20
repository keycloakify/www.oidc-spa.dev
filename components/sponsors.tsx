
import Image from 'next/image'
import Particles from './particles'
import Highlighter, { HighlighterItem } from './highlighter'

import FeatureImg01 from '@/public/images/feature-image-01.png'
import FeatureImg02 from '@/public/images/feature-image-02.png'
import FeatureImg03 from '@/public/images/feature-image-03.png'
import zone2PngUrl from '@/public/images/zone2.png'

import { linkClassName } from "@/components/utils/linkClassName";

export default function Sponsors() {
    return (
        <section className="relative">

            {/* Particles animation */}
            <div className="absolute left-1/2 -translate-x-1/2 top-0 -z-10 w-80 h-80 -mt-24 -ml-32">
                <Particles className="absolute inset-0 -z-10" quantity={6} staticity={30} />
            </div>

            <div className="max-w-6xl mx-auto px-4 sm:px-6">
                <div className="pt-16 md:pt-32">

          {/* Section header */}
          <div className="max-w-3xl mx-auto text-center pb-12 md:pb-20">
            <div>
              <div className="inline-flex font-medium bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-purple-200 pb-3">Sponsor</div>
            </div>
            {/*<h2 className="h2 bg-clip-text text-transparent bg-gradient-to-r from-slate-200/60 via-slate-200 to-slate-200/60 pb-4">Consulting</h2>*/}
            <p className="text-lg text-slate-400">
             <a className={linkClassName} href="https://www.zone2.tech/">Zone 2</a> is backing the project. We recommend their services.
            </p>
          </div>



                    <div className="relative pb-12 md:pb-20">
                        <div className="absolute bottom-0 -mb-20 left-1/2 -translate-x-1/2 blur-2xl opacity-50 pointer-events-none" aria-hidden="true">
                            <svg xmlns="http://www.w3.org/2000/svg" width="434" height="427">
                                <defs>
                                    <linearGradient id="bs2-a" x1="19.609%" x2="50%" y1="14.544%" y2="100%">
                                        <stop offset="0%" stopColor="#6366F1" />
                                        <stop offset="100%" stopColor="#6366F1" stopOpacity="0" />
                                    </linearGradient>
                                </defs>
                                <path fill="url(#bs2-a)" fillRule="evenodd" d="m346 898 461 369-284 58z" transform="translate(-346 -898)" />
                            </svg>
                        </div>
                        <Highlighter className="grid md:grid-cols-12 gap-6 group">
                            <div className="md:col-span-12" data-aos="fade-down">
                                <HighlighterItem>
                                    <div className="relative h-full bg-slate-900 rounded-[inherit] z-20 overflow-hidden">
                                        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                                            <div className="absolute right-0 top-0 blur-2xl" aria-hidden="true">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="342" height="393">
                                                    <defs>
                                                        <linearGradient id="bs-a" x1="19.609%" x2="50%" y1="14.544%" y2="100%">
                                                            <stop offset="0%" stopColor="#6366F1" />
                                                            <stop offset="100%" stopColor="#6366F1" stopOpacity="0" />
                                                        </linearGradient>
                                                    </defs>
                                                    <path fill="url(#bs-a)" fillRule="evenodd" d="m104 .827 461 369-284 58z" transform="translate(0 -112.827)" opacity=".7" />
                                                </svg>
                                            </div>
                                            <div className="absolute flex items-center justify-center bottom-0 translate-y-1/2 left-1/2 -translate-x-1/2 pointer-events-none -z-10 h-full aspect-square" aria-hidden="true">
                                                <div className="absolute inset-0 translate-z-0 bg-purple-500 rounded-full blur-[120px] opacity-70" />
                                                <div className="absolute w-1/4 h-1/4 translate-z-0 bg-purple-400 rounded-full blur-[40px]" />
                                            </div>
                                            <div className="md:max-w-[480px] shrink-0 order-1 md:order-none p-6 pt-0 md:p-8 md:pr-0">
                                                <div className="mb-5">
                                                    <div>
                                                        <h3 className="inline-flex text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-200/60 via-slate-200 to-slate-200/60 pb-1">
                                                        Keycloak Consulting Services 
                                                        </h3>
                                                        <p className="text-slate-400"> Your partner in Keycloak deployment, configuration, and extension development for optimized identity management solutions. </p>
                                                    </div>
                                                </div>
                                                <div>
                                                    <a 
                                                        className="btn-sm text-slate-300 hover:text-white transition duration-150 ease-in-out group [background:linear-gradient(theme(colors.slate.900),_theme(colors.slate.900))_padding-box,_conic-gradient(theme(colors.slate.400),_theme(colors.slate.700)_25%,_theme(colors.slate.700)_75%,_theme(colors.slate.400)_100%)_border-box] relative before:absolute before:inset-0 before:bg-slate-800/30 before:rounded-full before:pointer-events-none" 
                                                        href="https://www.zone2.tech/services/keycloak-consulting"
                                                    >
                                                        <span className="relative inline-flex items-center">
                                                            Learn more <span className="tracking-normal text-purple-500 group-hover:translate-x-0.5 transition-transform duration-150 ease-in-out ml-1">-&gt;</span>
                                                        </span>
                                                    </a>
                                                </div>
                                            </div>
                                            <div className="relative w-full h-64 md:h-auto overflow-hidden">
                                                <Image className="absolute bottom-0 left-1/2 -translate-x-1/2 mx-auto max-w-none md:relative md:left-0{md}transla{}-x-0" src={zone2PngUrl} width="504" height="400" alt="Feature 01" />
                                            </div>
                                        </div>
                                    </div>
                                </HighlighterItem>
                            </div>


                        </Highlighter>
                    </div>











                </div>
            </div>
        </section>
    )
}