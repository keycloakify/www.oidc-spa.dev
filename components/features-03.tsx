//import Image from 'next/image'
import Highlighter, { HighlighterItem } from "./highlighter";

//import FeatureImg04 from '@/public/images/feature-image-04.png'
import { linkClassName } from "@/components/utils/linkClassName";

export default function Features03() {
  return (
    <section className="relative">
      {/* Blurred shape */}
      <div
        className="absolute top-0 -translate-y-1/4 left-1/2 -translate-x-1/2 blur-2xl opacity-50 pointer-events-none -z-10"
        aria-hidden="true"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="434" height="427">
          <defs>
            <linearGradient
              id="bs3-a"
              x1="19.609%"
              x2="50%"
              y1="14.544%"
              y2="100%"
            >
              <stop offset="0%" stopColor="#6366F1" />
              <stop offset="100%" stopColor="#6366F1" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path
            fill="url(#bs3-a)"
            fillRule="evenodd"
            d="m410 0 461 369-284 58z"
            transform="matrix(1 0 0 -1 -410 427)"
          />
        </svg>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="pt-16 pb-12 md:pt-32 md:pb-20 border-b border-slate-800">
          {/* Section header */}
          <div className="max-w-3xl mx-auto text-center pb-12 md:pb-20">
            <h2 className="h2 bg-clip-text text-transparent bg-gradient-to-r from-slate-200/60 via-slate-200 to-slate-200/60 pb-4">
              Bridging the Gap Between Open-Source and Managed IAM Solutions
            </h2>
            <br />
            <p className="text-lg text-slate-400">
              Like{" "}
              <a
                href="https://keycloakify.dev"
                className={linkClassName}
                target="_blank"
              >
                Keycloakify
              </a>
              , <strong>Oidc-spa</strong> aims to provide tooling that makes
              open-source IAM solutions as seamless and competitive as platforms
              like
              <a
                target="_blank"
                href="https://auth0.com"
                className={linkClassName}
              >
                Auth0
              </a>
              ,
              <a
                target="_blank"
                href="https://www.okta.com"
                className={linkClassName}
              >
                Okta
              </a>
              , and{" "}
              <a
                target="_blank"
                href="https://clerk.com"
                className={linkClassName}
              >
                Clerk
              </a>
              —both for users and developers.
              <br />
              <br />
              Setting up an open-source solution like Keycloak can be
              overwhelming, especially for small projects or early-stage
              development.
              <strong>Oidc-spa</strong> lets you start with a convenient
              provider like{" "}
              <a
                target="_blank"
                href="https://auth0.com"
                className={linkClassName}
              >
                Auth0
              </a>
              while keeping the flexibility to switch to a self-hosted
              open-source solution later—without reworking your entire codebase.
            </p>
          </div>

          <div className="max-w-3xl mx-auto">
            <div data-aos="fade-down">
              <Highlighter className="group">
                <HighlighterItem>
                  <div className="relative h-full bg-slate-900 rounded-[inherit] z-20 overflow-hidden">
                    {/* Radial gradient */}
                    <div
                      className="absolute bottom-0 translate-y-1/2 left-1/2 -translate-x-1/2 pointer-events-none -z-10 w-1/2 aspect-square"
                      aria-hidden="true"
                    >
                      <div className="absolute inset-0 translate-z-0 bg-purple-500 rounded-full blur-[120px]" />
                    </div>
                    {/*<Image src={FeatureImg04} width={768} height={400} alt="Feature 04" />*/}
                    <video
                      className="css-w46r07-GlVideo-root-GlArticle-video-Home-articleVideo"
                      loop
                      autoPlay
                      playsInline
                      muted
                    >
                      <source
                        src="/videos/Login_rotato_render.mp4"
                        type='video/mp4; codecs="hvc1"'
                      />
                      <source
                        src="/videos/Login_rotato_render.webm"
                        type="video/webm"
                      />
                    </video>
                  </div>
                </HighlighterItem>
              </Highlighter>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
