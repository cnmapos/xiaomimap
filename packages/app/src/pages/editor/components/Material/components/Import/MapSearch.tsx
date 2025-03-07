import { SearchOutlined } from "@ant-design/icons";
import { Input, AutoComplete, AutoCompleteProps } from "antd";
import { useState, useEffect, useCallback } from "react";
import debounce from "lodash/debounce";
import loadAMapScript from "@/utils/loadAMap";
import "./index.less";

const Search: React.FC = () => {
  const [options, setOptions] = useState<AutoCompleteProps["options"]>([]);
  
  useEffect(() => {
    loadAMapScript();
  }, []);

  const handleInputChange = useCallback(
    debounce((value: string) => {
      window.AMap.plugin("AMap.AutoComplete", function () {
        const autoOptions = {
          city: "全国",
        };
        const autoComplete = new window.AMap.AutoComplete(autoOptions);
        autoComplete.search(value.trim(), function (status, result) {
          if (status === "complete" && result.info === "OK") {
            const options = result.tips.map((item: any) => ({
              value: item.id,
              label: item.name,
              ...item,
            }));
            setOptions(options);
          }
        });
      });
    }, 500),
    []
  );
  return (
    <div className="absolute map-search top-4 right-4">
      <AutoComplete
        options={options}
        className="!w-60"
        
        onSearch={(text) => handleInputChange(text)}
        popupClassName="!bg-black/70 !text-white map-search-popup"
      >
        <Input
          placeholder="请输入你要搜索的内容"
          allowClear
          className="!w-60 !bg-black/70 !text-white"
          suffix={<SearchOutlined />}
        />
      </AutoComplete>
    </div>
  );
};

export default Search;
