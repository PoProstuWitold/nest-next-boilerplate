module.exports = {
    mode: 'jit',
    purge: ['./src/**/*.{js,ts,jsx,tsx}'],
    theme: {
    },
    variants: {},
    plugins: [
        require('daisyui'),
        require('@tailwindcss/typography')
    ],
    daisyui: {
        styled: true,
        themes: true,
        base: true,
        utils: true,
        logs: true,
        rtl: false,
        themes: [
            "light", "dark", "cupcake", "bumblebee", "emerald", "corporate", "synthwave", "retro", 
            "cyberpunk", "valentine", "halloween", "garden", "forest", "aqua", "lofi", "pastel", 
            "fantasy", "wireframe", "black", "luxury", "dracula", "cmyk", "autumn", "business", 
            "acid", "lemonade", "night", "coffee", "winter",
            {
                chrupcio: {

                    "primary": "#ec4899",
                    
                    "secondary": "#fee2e2",
                    
                    "accent": "#f3f4f6",
                    
                    "neutral": "#111827",
                    
                    "base-100": "#1f2937",
                    
                    "info": "#38bdf8",
                    
                    "success": "#a3e635",
                    
                    "warning": "#fde047",
                    
                    "error": "#e11d48",
                            }
            }
        ]
    }
  };