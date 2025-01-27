import os
import fitz  # PyMuPDF

def combine_pages_in_one(input_pdf_path, output_pdf_path, pages_per_sheet=4):
    doc = fitz.open(input_pdf_path)
    output_doc = fitz.open()
    
    # Calculate rows and columns for pages per sheet
    cols = 4
    rows = (pages_per_sheet + cols - 1) // cols  # 2x2 grid for 4 pages per sheet
    
    def get_page_order(page_num, sheet_num):
        """Define the order based on sheet number."""
        if sheet_num % 2 == 0:  # Even sheets
            order = [0, 2, 4, 6, 8, 10, 12, 14]
        else:  # Odd sheets
            order = [-1, -3, -5, -7, 7, 5, 3, 1]
        return order[page_num]
    
    page_count = doc.page_count
    for i in range(0, page_count, pages_per_sheet):
        new_page = output_doc.new_page(width=842, height=595)  # A4 size in points, width=595, height=842
        
        for j in range(pages_per_sheet):
            page_index = i + get_page_order(j, i // pages_per_sheet)
            if page_index >= page_count:
                continue
            
            page = doc.load_page(page_index)
            rect = page.rect
            
            # Define the scale and position for each page in the grid
            scale_x = new_page.rect.width / (cols * rect.width)
            scale_y = new_page.rect.height / (rows * rect.height)
            scale = min(scale_x, scale_y)
            
            col = j % cols
            row = j // cols
            x_offset = col * rect.width * scale
            y_offset = row * rect.height * scale
            
            # Place page on new page
            new_page.show_pdf_page(
                fitz.Rect(x_offset, y_offset, x_offset + rect.width * scale, y_offset + rect.height * scale),
                doc, page_index
            )
    
    output_doc.save(output_pdf_path)
    output_doc.close()
    doc.close()

# Usage
folder = "pdf_stories"
file_names = [
    # "than_tai_hien_linh.pdf",
    "tung_lam.pdf"
]
for file_name in file_names:
    combine_pages_in_one(
        os.path.join(folder, file_name),
        os.path.join(folder, "8pages_" + file_name), 
        pages_per_sheet=8
    )