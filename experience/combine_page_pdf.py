import os
import fitz  # PyMuPDF

CONFIG = {
    4: {
        "landscape": False,
        "cols": 2,
        "rows": 2,
        "one_side": {
            "order": [
                [0, 2, 4, 6], # Even sheets
                [x - 4 for x in [3, 1, 7, 5]] # Odd sheets
            ]
        },
        "two_side": {
            "order": [
                [0, 3, 4, 7],
                [x - 4 for x in [2, 1, 6, 5]]
            ]
        }
    },
    8: {
        "landscape": True,
        "cols": 4,
        "rows": 2,
        "one_side": {
            "order": [
                [0, 2, 4, 6, 8, 10, 12, 14],
                [x - 8 for x in [7, 5, 3, 1, 15, 13, 11, 9]]
            ]
        },
        "two_side": {
            "order": [
                [0, 3, 4, 7, 8, 11, 12, 15],
                [x - 8 for x in [6, 5, 2, 1, 14, 13, 10, 9]]
            ]
        }
    }
}

def combine_pages_in_one(input_pdf_path, output_pdf_path, pages_per_sheet=4, two_sided=False):
    doc = fitz.open(input_pdf_path)
    output_doc = fitz.open()
    
    # Calculate rows and columns for pages per sheet
    side = "two_side" if two_sided else "one_side"
    cols = CONFIG[pages_per_sheet]["cols"]
    rows = CONFIG[pages_per_sheet]["rows"]
    
    def get_page_order(page_num, sheet_num):
        """Define the order based on sheet number."""
        order = CONFIG[pages_per_sheet][side]["order"][sheet_num % 2]
        return order[page_num]
    
    # A4 size in points, width=595, height=842
    width=842
    height=595
    landscape = CONFIG[pages_per_sheet]["landscape"]
    if not landscape:
        [width, height] = [height, width]
    
    page_count = doc.page_count
    for i in range(0, page_count, pages_per_sheet):
        new_page = output_doc.new_page(width=width, height=height)
        
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


def main():
    PAGES_PER_SHEET = 8
    TWO_SIDED = False
    # TWO_SIDED = True
    folder = "pdf_stories"
    file_names = [
        # "than_tai_hien_linh.pdf",
        # "tung_lam.pdf",
        "nunujada.pdf"
    ]
    for file_name in file_names:
        combine_pages_in_one(
            os.path.join(folder, file_name),
            os.path.join(folder, str(PAGES_PER_SHEET) +"pages_" + ("2sided_" if TWO_SIDED else '') + file_name), 
            pages_per_sheet=PAGES_PER_SHEET,
            two_sided=TWO_SIDED
        )
        
if __name__ == "__main__":
    main()