import { Instagram, Facebook, Linkedin, Mail, ArrowRight } from 'lucide-react'

export function Footer() {
    return (
        <footer className="bg-neutral-900 text-neutral-100 py-12 px-4">
            <div className="max-w-6xl mx-auto">
                <div className="grid md:grid-cols-4 gap-6 mb-10">
                    <div>
                        <h3 className="text-lg font-serif font-medium mb-4 text-neutral-100">Learn</h3>
                        <ul className="space-y-2 text-neutral-300">
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
                        <h3 className="text-lg font-serif font-medium mb-4 text-neutral-100">About</h3>
                        <ul className="space-y-2 text-neutral-300">
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
                        <h3 className="text-lg font-serif font-medium mb-4 text-neutral-100">Support</h3>
                        <ul className="space-y-2 text-neutral-300">
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
                        <h3 className="text-lg font-serif font-medium mb-4 text-neutral-100">Legal</h3>
                        <ul className="space-y-2 text-neutral-300">
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

                <div className="border-t border-neutral-700 pt-8 mb-8">
                    <div className="max-w-md mx-auto text-center">
                        <div className="w-12 h-12 bg-[var(--color-primary-400)] rounded-2xl flex items-center justify-center mb-4 mx-auto">
                            <Mail className="w-6 h-6 text-white" />
                        </div>
                        <h3 className="text-xl font-serif font-medium mb-3">Newsletter Signup</h3>
                        <p className="text-neutral-300 mb-4 leading-relaxed font-light text-sm">
                            Get the latest updates on events and membership opportunities
                        </p>
                        <div className="flex gap-2">
                            <input
                                type="email"
                                placeholder="Enter your email"
                                className="flex-1 px-3 py-2 bg-neutral-800 border border-neutral-600 rounded-lg text-neutral-100 placeholder-neutral-400 focus:outline-none focus:border-[var(--color-primary-400)] focus:ring-1 focus:ring-[var(--color-primary-400)] text-sm"
                            />
                            <button className="px-4 py-2 bg-[var(--color-primary-500)] text-white rounded-lg hover:bg-[var(--color-primary-600)] transition-all duration-300 font-medium inline-flex items-center gap-1 text-sm">
                                Subscribe <ArrowRight className="w-3 h-3" />
                            </button>
                        </div>
                    </div>
                </div>

                <div className="border-t border-neutral-700 pt-6">
                    <div className="flex flex-col md:flex-row justify-between items-center">
                        <div className="mb-4 md:mb-0 text-center md:text-left">
                            <h2 className="text-2xl font-serif font-light text-neutral-100 mb-1">Brickell Babes</h2>
                            <p className="text-neutral-300 font-light text-sm">Your success network starts here.</p>
                        </div>

                        <div className="flex space-x-4">
                            <a
                                href="#"
                                className="text-neutral-300 hover:text-[var(--color-primary-400)] transition-colors duration-300 hover:scale-110 transform"
                                aria-label="Instagram"
                            >
                                <Instagram className="w-5 h-5" />
                            </a>
                            <a
                                href="#"
                                className="text-neutral-300 hover:text-[var(--color-primary-400)] transition-colors duration-300 hover:scale-110 transform"
                                aria-label="Facebook"
                            >
                                <Facebook className="w-5 h-5" />
                            </a>
                            <a
                                href="#"
                                className="text-neutral-300 hover:text-[var(--color-primary-400)] transition-colors duration-300 hover:scale-110 transform"
                                aria-label="LinkedIn"
                            >
                                <Linkedin className="w-5 h-5" />
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    )
}
