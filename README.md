# DOCX to React Component Generator

A Python application that converts DOCX files into responsive React functional components with Tailwind CSS styling. Perfect for creating ready-to-use components for terms and conditions, privacy policies, documentation, and other text-heavy content.

## 🚀 Features

- **📄 DOCX Parsing**: Extracts headings, paragraphs, and hyperlinks from DOCX files
- **⚛️ React Components**: Generates clean, functional React components (rafce pattern)
- **🎨 Tailwind CSS**: Includes responsive, mobile-first Tailwind CSS classes
- **📱 Responsive Design**: Automatically applies responsive typography and spacing
- **🔗 Link Preservation**: Maintains hyperlinks with proper styling and accessibility
- **🖥️ User-Friendly UI**: Easy-to-use Streamlit web interface
- **💾 Export Options**: Download generated components as .jsx files

## 📋 Supported Elements

- **Headings** (H1-H6) with automatic level detection
- **Paragraphs** with proper spacing and typography
- **Hyperlinks** with hover effects and accessibility features
- **Various text styles** from Word documents

## 🎨 Styling Features

- **Mobile-first responsive design**
- **Accessible color scheme**
- **Typography scaling** for different screen sizes
- **Hover effects** on interactive elements
- **Proper semantic HTML** structure

## 🛠️ Installation

1. **Clone or download this repository**
2. **Install Python dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

3. **Run the application:**
   ```bash
   streamlit run app.py
   ```

4. **Open your browser** and navigate to the URL shown in the terminal (usually `http://localhost:8501`)

## 📖 Usage

### Step 1: Upload DOCX File
1. Open the application in your browser
2. Use the file uploader to select your DOCX file
3. The application supports standard Word documents with headings, paragraphs, and links

### Step 2: Configure Component
1. Enter a custom component name in the sidebar (optional)
2. The name will be automatically converted to PascalCase
3. Review the supported elements and styling features

### Step 3: Generate Component
1. The application automatically processes your file
2. View the document structure preview on the left
3. See the generated React component code on the right
4. Download the component as a .jsx file or copy the code

### Step 4: Use in Your React Project

1. **Make sure Tailwind CSS is installed in your React project:**
   ```bash
   npm install -D tailwindcss postcss autoprefixer
   npx tailwindcss init -p
   ```

2. **Configure your `tailwind.config.js`:**
   ```javascript
   /** @type {import('tailwindcss').Config} */
   module.exports = {
     content: [
       "./src/**/*.{js,jsx,ts,tsx}",
     ],
     theme: {
       extend: {},
     },
     plugins: [],
   }
   ```

3. **Add Tailwind directives to your CSS:**
   ```css
   @tailwind base;
   @tailwind components;
   @tailwind utilities;
   ```

4. **Import and use your generated component:**
   ```javascript
   import React from 'react';
   import DocumentComponent from './DocumentComponent';

   function App() {
     return (
       <div className="App">
         <DocumentComponent />
       </div>
     );
   }

   export default App;
   ```

## 🔧 Technical Details

### Dependencies
- **Streamlit**: Web interface framework
- **python-docx**: DOCX file parsing
- **lxml**: XML processing for hyperlink extraction
- **typing-extensions**: Type hints support

### Generated Component Structure
```javascript
import React from 'react';

const YourComponent = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="prose prose-lg max-w-none">
        {/* Your content with Tailwind classes */}
      </div>
    </div>
  );
};

export default YourComponent;
```

### Responsive Breakpoints
- **Small (sm)**: 640px and up
- **Large (lg)**: 1024px and up
- **Mobile-first**: Base styles for mobile, enhanced for larger screens

## 🎯 Use Cases

- **Legal Documents**: Terms of service, privacy policies, user agreements
- **Documentation**: API docs, user guides, help pages
- **Content Pages**: About pages, company policies, FAQs
- **Blog Posts**: Converting Word documents to web-ready components
- **Educational Content**: Course materials, lesson plans

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📝 License

This project is open source and available under the MIT License.

## 🐛 Troubleshooting

### Common Issues

**"No content found in the uploaded file"**
- Ensure your DOCX file contains text content
- Check that the file is not corrupted
- Verify the file is in .docx format (not .doc)

**"Error processing file"**
- Make sure the file is a valid DOCX document
- Try opening the file in Microsoft Word to verify it's not corrupted
- Check that the file contains readable text content

**Missing styling in React app**
- Ensure Tailwind CSS is properly installed and configured
- Check that your build process includes Tailwind
- Verify the generated classes are not being purged by Tailwind

### Performance Tips

- For large documents, consider breaking them into smaller components
- Use the prose plugin with Tailwind for better typography defaults
- Test responsive behavior on different screen sizes

## 🔮 Future Enhancements

- Support for images and tables
- Custom styling themes
- Bulk processing of multiple files
- Integration with popular CMS platforms
- Advanced typography options
- Dark mode support
