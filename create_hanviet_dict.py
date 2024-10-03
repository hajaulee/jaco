from collections import OrderedDict
import json

from kyujipy import KyujitaiConverter

kanji_converter = KyujitaiConverter()


def read_file_by_lines(file_path, tranform_line):
    ret_dict = dict()
    with open(file_path, 'r', encoding="utf-8") as input_file:
        lines = input_file.readlines()
        for line in lines:
            tranform_line(ret_dict, line)
    return ret_dict


def read_hanviet_single_list():
    def transform_line(ret_dict, line):
        cols = line.split("    ")
        ret_dict[cols[0]] = cols[1]
    return read_file_by_lines('resources/hanviet_single_list.txt', transform_line)      


def read_chinese_hanviet_congnates():
    def transform_line(ret_dict, line):
        cols = line.split("\t")
        traditional_hantu = cols[3]
        jp_kanji = kanji_converter.kyujitai_to_shinjitai(traditional_hantu)
        hanviet_words = cols[5].split("/")
        for word in hanviet_words:
            ret_dict[word] = jp_kanji
    return read_file_by_lines('resources/chinese-hanviet-cognates.tsv', transform_line)
  
  
def read_addition_hanviet_list():
    def transform_line(ret_dict, line):
        cols = line.split("    ")
        ret_dict[cols[0]] = cols[1].strip()
    return read_file_by_lines('resources/addition-hanviet-list.txt', transform_line)     


def main():
    hanviet_dict = OrderedDict()
    hanviet_dict.update(read_hanviet_single_list())
    hanviet_dict.update(read_chinese_hanviet_congnates())
    hanviet_dict.update(read_addition_hanviet_list())
    
    with open("extension/hanviet_dict.json", 'w', encoding="utf-8") as output_file:
        json.dump(hanviet_dict, output_file, ensure_ascii=False, indent=2)

if __name__ == "__main__":
    main()