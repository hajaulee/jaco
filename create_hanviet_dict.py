from collections import OrderedDict
import json

from kyujipy import KyujitaiConverter

kanji_converter = KyujitaiConverter()

def read_hanviet_single_list():
    ret_dict = dict()
    with open('resources/hanviet_single_list.txt', 'r', encoding="utf-8") as input_file:
        lines = input_file.readlines()
        for line in lines:
            cols = line.split("    ")
            ret_dict[cols[0]] = cols[1]
    return ret_dict        

def read_chinese_hanviet_congnates():
    ret_dict = dict()
    with open('resources/chinese-hanviet-cognates.tsv', 'r', encoding="utf-8") as input_file:
        lines = input_file.readlines()
        for line in lines[1:]:
            cols = line.split("\t")
            traditional_hantu = cols[3]
            jp_kanji = kanji_converter.kyujitai_to_shinjitai(traditional_hantu)
            hanviet_words = cols[5].split("/")
            for word in hanviet_words:
                ret_dict[word] = jp_kanji
    return ret_dict

def main():
    hanviet_dict = OrderedDict()
    hanviet_dict.update(read_hanviet_single_list())
    hanviet_dict.update(read_chinese_hanviet_congnates())
    
    with open("extension/hanviet_dict.json", 'w', encoding="utf-8") as output_file:
        json.dump(hanviet_dict, output_file, ensure_ascii=False, indent=2)

if __name__ == "__main__":
    main()