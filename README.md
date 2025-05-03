# Pixel Emoji Battle

Welcome to Pixel Emoji Battle! This is a fun, interactive web application built with Next.js where you can unleash your creativity by designing unique emoji-like characters using a variety of pre-defined elements. Share your creations, participate in daily challenges, and soon, battle your emojis against others!

## ✨ Features

*   **🎨 Emoji Composer:**
    *   Create custom emojis on a dynamic canvas.
    *   Choose from various base shapes (circles, squares).
    *   Add elements like eyes, mouths, and accessories.
    *   Customize element color, size, position, rotation, and layer order (z-index).
    *   Drag and drop elements onto the canvas.
    *   Select elements to modify their properties using intuitive controls.
    *   Use predefined templates as starting points.
*   **💾 Save & Load:** Save your emoji compositions to your browser's local storage and load them later.
*   **📥 Download:** Download your creations as PNG or SVG files in various sizes (64px, 128px, 256px, 512px).
*   **🏆 Daily Challenge:** Participate in themed daily challenges by submitting your emoji art (description-based for now).
*   **👀 View Art:** View individual art pieces on dedicated pages (placeholder implementation).
*   **❤️ Like & Share:** Engage with art by liking and easily sharing links.
*   **🚩 Report:** Flag inappropriate content (placeholder functionality).
*   **🎨 Modern UI:** Built with ShadCN UI components and Tailwind CSS for a clean, responsive, and aesthetically pleasing interface.
*   **🚀 Built with Next.js:** Leverages the Next.js App Router for performance and modern web features.

## 🛠️ Technology Stack

*   **Framework:** [Next.js](https://nextjs.org/) (App Router)
*   **Language:** [TypeScript](https://www.typescriptlang.org/)
*   **Styling:** [Tailwind CSS](https://tailwindcss.com/)
*   **UI Components:** [ShadCN UI](https://ui.shadcn.com/)
*   **State Management:** React Hooks (`useState`, `useEffect`, `useRef`)
*   **Icons:** [Lucide React](https://lucide.dev/)

## 🚀 Getting Started

Follow these instructions to get the project up and running on your local machine.

### Prerequisites

*   [Node.js](https://nodejs.org/) (Version 18.x or later recommended)
*   [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)

### Installation

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd pixel-emoji-battle
    ```
2.  **Install dependencies:**
    ```bash
    npm install
    # or
    # yarn install
    ```

### Running the Development Server

1.  **Start the app:**
    ```bash
    npm run dev
    # or
    # yarn dev
    ```
2.  Open your browser and navigate to [http://localhost:9002](http://localhost:9002) (or the port specified in your terminal).

## 🕹️ How to Use

1.  **Homepage (`/`):** Get an overview of the app's features and navigate to different sections.
2.  **Create Page (`/create`):**
    *   This is the main canvas for designing your emojis.
    *   Use the **Tools & Elements** panel on the right:
        *   **Elements Tab:** Browse base shapes, eyes, mouths, and accessories. Click an element to add it to the center of the canvas.
        *   **Templates Tab:** Select a predefined emoji design to load onto the canvas as a starting point.
        *   **Controls Tab:** Select an element on the canvas by clicking it. This tab will then allow you to:
            *   Change its color using the color picker or palette.
            *   Adjust its size using the slider.
            *   Rotate it clockwise or counter-clockwise.
            *   Change its layer order (bring forward/send backward).
            *   Delete the selected element.
    *   **Canvas Interaction:**
        *   Click and drag elements to move them.
        *   Click the canvas background to deselect any element.
    *   **Top Bar Buttons:**
        *   `Clear Canvas`: Removes all elements.
        *   `Load Saved`: Loads the last saved composition from local storage.
    *   **Footer Buttons:**
        *   `Save`: Saves the current composition to local storage.
        *   `Download`: Opens a dialog to choose a format (PNG/SVG) and size, then downloads the emoji.
3.  **Challenge Page (`/challenge`):**
    *   View the daily theme.
    *   Describe your emoji art related to the theme in the text area.
    *   Submit your entry (currently saves description conceptually).
4.  **Art Display Page (`/art/[id]`):**
    *   View a specific (currently simulated) piece of emoji art.
    *   Like, Share, or Report the artwork (like/report are placeholders).

## 🔮 Future Features

*   **Firebase Integration:**
    *   User Authentication (Sign up/Login).
    *   Saving emoji art to Firestore database.
    *   Fetching real art data for display and challenges.
*   **Battle Mode:** A dedicated section where users can vote on pairs of emoji art in head-to-head matchups.
*   **Leaderboards:** Display top-rated artists and challenge winners.
*   **Premium Packs:** Offer additional element packs for purchase (requires Stripe integration).
*   **AI Judging:** Integrate Generative AI (like Gemini via Genkit) to provide fun, automated feedback on challenge submissions.
*   **Improved Sharing:** Generate images for social media sharing.
*   **Community Features:** User profiles, comments on art.

## 🤝 Contributing

Contributions are welcome! If you'd like to contribute, please fork the repository and submit a pull request. For major changes, please open an issue first to discuss what you would like to change.

(Further contribution guidelines can be added here, e.g., coding standards, commit message format).

## 📄 License

(Specify a license if applicable, e.g., MIT License)

---

Happy Emoji Crafting! 🎉
