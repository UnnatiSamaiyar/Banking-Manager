import streamlit as st
import docx
from docx.document import Document
from docx.oxml.text.paragraph import CT_P
from docx.oxml.table import CT_Tbl
from docx.table import _Cell, Table
from docx.text.paragraph import Paragraph
import re
from typing import List, Dict, Any
import zipfile
import tempfile
import os

def extract_text_from_docx(file) -> List[Dict[str, Any]]:
    """
    Extract structured content from DOCX file including headings, paragraphs, and links.
    Returns a list of content blocks with their types and styling information.
    """
    doc = docx.Document(file)
    content_blocks = []
    
    for element in doc.element.body:
        if isinstance(element, CT_P):
            paragraph = Paragraph(element, doc)
            text = paragraph.text.strip()
            
            if not text:
                continue
                
            # Determine if it's a heading based on style
            style_name = paragraph.style.name if paragraph.style else "Normal"
            
            # Extract links from the paragraph
            links = extract_links_from_paragraph(paragraph)
            
            # Determine content type and level
            if "Heading" in style_name:
                level = extract_heading_level(style_name)
                content_blocks.append({
                    "type": "heading",
                    "level": level,
                    "text": text,
                    "links": links
                })
            else:
                content_blocks.append({
                    "type": "paragraph",
                    "text": text,
                    "links": links,
                    "style": style_name
                })
    
    return content_blocks

def extract_links_from_paragraph(paragraph) -> List[Dict[str, str]]:
    """Extract hyperlinks from a paragraph."""
    links = []
    for run in paragraph.runs:
        if run.element.xpath('.//w:hyperlink'):
            for hyperlink in run.element.xpath('.//w:hyperlink'):
                link_id = hyperlink.get('{http://schemas.openxmlformats.org/officeDocument/2006/relationships}id')
                if link_id:
                    try:
                        url = paragraph.part.rels[link_id].target_ref
                        link_text = ''.join([node.text for node in hyperlink.xpath('.//w:t', namespaces={'w': 'http://schemas.openxmlformats.org/wordprocessingml/2006/main'})])
                        if link_text and url:
                            links.append({"text": link_text, "url": url})
                    except:
                        pass
    return links

def extract_heading_level(style_name: str) -> int:
    """Extract heading level from style name."""
    match = re.search(r'Heading (\d+)', style_name)
    if match:
        return int(match.group(1))
    elif style_name.lower() == "title":
        return 1
    return 1

def generate_react_component(content_blocks: List[Dict[str, Any]], component_name: str = "DocumentComponent") -> str:
    """
    Generate a React functional component with Tailwind CSS styling.
    """
    
    # Convert component name to PascalCase
    component_name = ''.join(word.capitalize() for word in re.findall(r'\w+', component_name))
    
    jsx_content = []
    
    for block in content_blocks:
        if block["type"] == "heading":
            jsx_content.append(generate_heading_jsx(block))
        elif block["type"] == "paragraph":
            jsx_content.append(generate_paragraph_jsx(block))
    
    component_code = f"""import React from 'react';

const {component_name} = () => {{
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="prose prose-lg max-w-none">
{chr(10).join(['        ' + line for line in jsx_content])}
      </div>
    </div>
  );
}};

export default {component_name};"""

    return component_code

def generate_heading_jsx(block: Dict[str, Any]) -> str:
    """Generate JSX for heading elements with appropriate Tailwind classes."""
    level = block["level"]
    text = escape_jsx_text(block["text"])
    
    # Define responsive heading classes
    heading_classes = {
        1: "text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight",
        2: "text-2xl sm:text-3xl lg:text-4xl font-semibold text-gray-800 mb-5 mt-8 leading-tight", 
        3: "text-xl sm:text-2xl lg:text-3xl font-semibold text-gray-800 mb-4 mt-6 leading-tight",
        4: "text-lg sm:text-xl lg:text-2xl font-medium text-gray-700 mb-3 mt-5 leading-tight",
        5: "text-base sm:text-lg lg:text-xl font-medium text-gray-700 mb-3 mt-4 leading-tight",
        6: "text-sm sm:text-base lg:text-lg font-medium text-gray-600 mb-2 mt-3 leading-tight"
    }
    
    heading_tag = f"h{min(level, 6)}"
    css_class = heading_classes.get(level, heading_classes[6])
    
    if block.get("links"):
        text_with_links = process_links_in_text(text, block["links"])
        return f'<{heading_tag} className="{css_class}">{text_with_links}</{heading_tag}>'
    
    return f'<{heading_tag} className="{css_class}">{text}</{heading_tag}>'

def generate_paragraph_jsx(block: Dict[str, Any]) -> str:
    """Generate JSX for paragraph elements with responsive styling."""
    text = escape_jsx_text(block["text"])
    
    # Base paragraph classes with responsive typography
    css_class = "text-sm sm:text-base lg:text-lg text-gray-700 mb-4 leading-relaxed"
    
    if block.get("links"):
        text_with_links = process_links_in_text(text, block["links"])
        return f'<p className="{css_class}">{text_with_links}</p>'
    
    return f'<p className="{css_class}">{text}</p>'

def process_links_in_text(text: str, links: List[Dict[str, str]]) -> str:
    """Replace link text in content with JSX link elements."""
    processed_text = text
    
    for link in links:
        link_text = escape_jsx_text(link["text"])
        url = link["url"]
        
        # Create responsive link styling
        link_jsx = f'<a href="{url}" className="text-blue-600 hover:text-blue-800 underline transition-colors duration-200 break-words" target="_blank" rel="noopener noreferrer">{link_text}</a>'
        processed_text = processed_text.replace(link["text"], link_jsx)
    
    return processed_text

def escape_jsx_text(text: str) -> str:
    """Escape special characters for JSX."""
    # Replace special JSX characters
    text = text.replace("&", "&amp;")
    text = text.replace("<", "&lt;")
    text = text.replace(">", "&gt;")
    text = text.replace('"', "&quot;")
    text = text.replace("'", "&#39;")
    return text

def main():
    st.set_page_config(
        page_title="DOCX to React Component Generator",
        page_icon="📄",
        layout="wide"
    )
    
    st.title("📄 DOCX to React Component Generator")
    st.markdown("Upload a DOCX file to generate a responsive React component with Tailwind CSS styling.")
    
    # Sidebar for configuration
    with st.sidebar:
        st.header("⚙️ Configuration")
        component_name = st.text_input(
            "Component Name", 
            value="DocumentComponent",
            help="Enter the name for your React component (will be converted to PascalCase)"
        )
        
        st.markdown("---")
        st.markdown("### 📋 Supported Elements")
        st.markdown("""
        - **Headings** (H1-H6)
        - **Paragraphs**
        - **Hyperlinks**
        - **Various text styles**
        """)
        
        st.markdown("---")
        st.markdown("### 🎨 Styling Features")
        st.markdown("""
        - **Responsive design** (mobile-first)
        - **Tailwind CSS** classes
        - **Typography scaling**
        - **Accessible colors**
        - **Hover effects**
        """)
    
    # File upload section
    uploaded_file = st.file_uploader(
        "Choose a DOCX file",
        type="docx",
        help="Upload a .docx file containing your document content"
    )
    
    if uploaded_file is not None:
        try:
            with st.spinner("Processing DOCX file..."):
                # Extract content from DOCX
                content_blocks = extract_text_from_docx(uploaded_file)
                
                if not content_blocks:
                    st.warning("No content found in the uploaded file.")
                    return
                
                # Generate React component
                react_component = generate_react_component(content_blocks, component_name)
            
            st.success("✅ React component generated successfully!")
            
            # Display preview
            col1, col2 = st.columns([1, 1])
            
            with col1:
                st.subheader("📄 Document Structure Preview")
                for i, block in enumerate(content_blocks[:10]):  # Show first 10 blocks
                    if block["type"] == "heading":
                        st.markdown(f"**H{block['level']}:** {block['text'][:100]}{'...' if len(block['text']) > 100 else ''}")
                    else:
                        st.markdown(f"**Paragraph:** {block['text'][:100]}{'...' if len(block['text']) > 100 else ''}")
                
                if len(content_blocks) > 10:
                    st.markdown(f"*... and {len(content_blocks) - 10} more blocks*")
            
            with col2:
                st.subheader("⚛️ Generated React Component")
                st.code(react_component, language="javascript")
                
                # Download button
                st.download_button(
                    label="📥 Download React Component",
                    data=react_component,
                    file_name=f"{component_name}.jsx",
                    mime="text/javascript"
                )
                
                # Copy to clipboard button
                if st.button("📋 Copy to Clipboard"):
                    st.code(react_component, language="javascript")
                    st.success("Component code displayed above - you can select and copy it!")
            
            # Additional information
            st.markdown("---")
            st.subheader("🚀 Usage Instructions")
            
            usage_col1, usage_col2 = st.columns([1, 1])
            
            with usage_col1:
                st.markdown("""
                ### Installation
                Make sure you have Tailwind CSS installed in your React project:
                ```bash
                npm install -D tailwindcss
                npx tailwindcss init
                ```
                """)
            
            with usage_col2:
                st.markdown(f"""
                ### Usage
                1. Save the generated code as `{component_name}.jsx`
                2. Import and use in your React app:
                ```javascript
                import {component_name} from './{component_name}';

                function App() {{
                  return <{component_name} />;
                }}
                ```
                """)
                
        except Exception as e:
            st.error(f"Error processing file: {str(e)}")
            st.markdown("Please make sure you uploaded a valid DOCX file.")

if __name__ == "__main__":
    main()