import { Instagram, Facebook, Linkedin, Mail, ArrowRight } from 'lucide-react'

export function Footer() {
    return (
        <footer className="bg-neutral-900 text-neutral-100 py-20 px-4">
            <div className="max-w-6xl mx-auto">
                <div className="grid md:grid-cols-4 gap-8 mb-16">
                    <div>
                        <h3 className="text-xl font-serif font-medium mb-6 text-neutral-100">Learn</h3>
                        <ul className="space-y-3 text-neutral-300">
                            <li>
                                <a
                                    href="#"
                                    className="hover:text-[var(--color-primary-400)] transition-colors duration-300 hover:translate-x-1 inline-block font-light"
                                >
                                    Waitlist Info
                                </a>
                            </li>
                            <li>
                                <a
                                    href="#"
                                    className="hover:text-[var(--color-primary-400)] transition-colors duration-300 hover:translate-x-1 inline-block font-light"
                                >
                                    Events
                                </a>
                            </li>
                            <li>
                                <a
                                    href="#"
                                    className="hover:text-[var(--color-primary-400)] transition-colors duration-300 hover:translate-x-1 inline-block font-light"
                                >
                                    Press
                                </a>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-xl font-serif font-medium mb-6 text-neutral-100">About</h3>
                        <ul className="space-y-3 text-neutral-300">
                            <li>
                                <a
                                    href="#"
                                    className="hover:text-[var(--color-primary-400)] transition-colors duration-300 hover:translate-x-1 inline-block font-light"
                                >
                                    Our Story
                                </a>
                            </li>
                            <li>
                                <a
                                    href="#"
                                    className="hover:text-[var(--color-primary-400)] transition-colors duration-300 hover:translate-x-1 inline-block font-light"
                                >
                                    Join as an Ambassador
                                </a>
                            </li>
                            <li>
                                <a
                                    href="#"
                                    className="hover:text-[var(--color-primary-400)] transition-colors duration-300 hover:translate-x-1 inline-block font-light"
                                >
                                    Partner With Us
                                </a>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-xl font-serif font-medium mb-6 text-neutral-100">Support</h3>
                        <ul className="space-y-3 text-neutral-300">
                            <li>
                                <a
                                    href="#"
                                    className="hover:text-[var(--color-primary-400)] transition-colors duration-300 hover:translate-x-1 inline-block font-light"
                                >
                                    FAQ
                                </a>
                            </li>
                            <li>
                                <a
                                    href="#"
                                    className="hover:text-[var(--color-primary-400)] transition-colors duration-300 hover:translate-x-1 inline-block font-light"
                                >
                                    Contact
                                </a>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-xl font-serif font-medium mb-6 text-neutral-100">Legal</h3>
                        <ul className="space-y-3 text-neutral-300">
                            <li>
                                <a
                                    href="#"
                                    className="hover:text-[var(--color-primary-400)] transition-colors duration-300 hover:translate-x-1 inline-block font-light"
                                >
                                    Privacy Policy
                                </a>
                            </li>
                            <li>
                                <a
                                    href="#"
                                    className="hover:text-[var(--color-primary-400)] transition-colors duration-300 hover:translate-x-1 inline-block font-light"
                                >
                                    Terms
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-neutral-700 pt-12 mb-12">
                    <div className="max-w-md mx-auto text-center">
                        <div className="w-16 h-16 bg-[var(--color-primary-400)] rounded-2xl flex items-center justify-center mb-6 mx-auto">
                            <Mail className="w-8 h-8 text-white" />
                        </div>
                        <h3 className="text-2xl font-serif font-medium mb-4">Newsletter Signup</h3>
                        <p className="text-neutral-300 mb-6 leading-relaxed font-light">
                            Get the latest updates on events and membership opportunities
                        </p>
                        <div className="flex gap-3">
                            <input
                                type="email"
                                placeholder="Enter your email"
                                className="flex-1 px-4 py-3 bg-neutral-800 border border-neutral-600 rounded-xl text-neutral-100 placeholder-neutral-400 focus:outline-none focus:border-[var(--color-primary-400)] focus:ring-1 focus:ring-[var(--color-primary-400)]"
                            />
                            <button className="px-6 py-3 bg-[var(--color-primary-500)] text-white rounded-xl hover:bg-[var(--color-primary-600)] transition-all duration-300 font-medium inline-flex items-center gap-2">
                                Subscribe <ArrowRight className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </div>

                <div className="border-t border-neutral-700 pt-8">
                    <div className="flex flex-col md:flex-row justify-between items-center">
                        <div className="mb-6 md:mb-0 text-center md:text-left">
                            <h2 className="text-3xl font-serif font-light text-neutral-100 mb-2">Brickell Babes</h2>
                            <p className="text-neutral-300 font-light">Your success network starts here.</p>
                        </div>

                        <div className="flex space-x-6">
                            <a
                                href="#"
                                className="text-neutral-300 hover:text-[var(--color-primary-400)] transition-colors duration-300 hover:scale-110 transform"
                                aria-label="Instagram"
                            >
                                <Instagram className="w-7 h-7" />
                            </a>
                            <a
                                href="#"
                                className="text-neutral-300 hover:text-[var(--color-primary-400)] transition-colors duration-300 hover:scale-110 transform"
                                aria-label="Facebook"
                            >
                                <Facebook className="w-7 h-7" />
                            </a>
                            <a
                                href="#"
                                className="text-neutral-300 hover:text-[var(--color-primary-400)] transition-colors duration-300 hover:scale-110 transform"
                                aria-label="LinkedIn"
                            >
                                <Linkedin className="w-7 h-7" />
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    )
}
