import { SearchOutlined } from "@ant-design/icons";
import { Input, AutoComplete, AutoCompleteProps, Button } from "antd";
import { useState, useEffect, useCallback } from "react";
import debounce from "lodash/debounce";
import loadAMapScript from "@/utils/loadAMap";
import MapPanel from "./MapPanel";
import { FALLBACK_IMG_URL } from "@/constant";
import "./index.less";

export interface PlaceType {
  name: string;
  address: string;
  location: {
    lng: number;
    lat: number;
  };
}


const Search: React.FC<{  
  onSelect: (v: any) => void;
  onReset?: () => void;
  // 新增到要素
  onAddToAsset?: (place: PlaceType) => void;
}> = (props) => {
  const [options, setOptions] = useState<AutoCompleteProps["options"]>([]);
  const [place, setPlace] = useState<PlaceType | null>(null);
  useEffect(() => {
    loadAMapScript();
  }, []);

  const handleInputChange = useCallback(
    debounce((value: string) => {
      // window.AMap.plugin("AMap.AutoComplete", function () {
      //   const autoOptions = {
      //     // city: "全国",
      //   };
      //   const autoComplete = new window.AMap.AutoComplete(autoOptions);
      //   autoComplete.search(value.trim(), function (status, result) {
      //     if (status === "complete" && result.info === "OK") {
      //       const options = result.tips.map((item: any) => ({
      //         value: `${item.adcode}_${item.id}`,
      //         label: item.name,
      //         ...item,
      //       }));
      //       console.log(options)
      //       setOptions(options);
      //     }
      //   });
      // });
      window.AMap.plugin(["AMap.PlaceSearch"], function () {
        //构造地点查询类
        const placeSearch = new window.AMap.PlaceSearch({
          pageSize: 15,
        });
        //关键字查询
        placeSearch.search(value.trim(), function (status, result) {
          if (status === "complete" && result.info === "OK") {
            const options = (result.poiList.pois || []).map((item: any) => ({
              value: `${item.name}`,
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
  const onSelect = (value, options) => {
    console.log("poi select", value, options);
    props.onSelect(options);
    setPlace(options);
  };
  const handleAddToAsset = () => {
    if (!place) return;
    props.onAddToAsset?.(place);
    setPlace(null);
  }
  return (
    <div className="absolute map-search top-4 right-4 z-10">
      <AutoComplete
        options={options}
        className="!w-60"
        onSelect={onSelect}
        onSearch={(text) => handleInputChange(text)}
        popupClassName="!bg-neutral-800/80 !text-white map-search-popup"
      >
        <Input
          placeholder="请输入你要搜索的内容"
          onFocus={props.onReset}
          className="!w-60 !bg-black/70 !text-white"
          suffix={<SearchOutlined />}
        />
      </AutoComplete>
      {place && (
        <MapPanel
          onClose={() => setPlace(null)}
          title={place?.name || "-"}
          className="w-full left-0 !top-16"
        >
          <img
            className="h-40 object-cover w-full rounded-sm"
            src={place?.cover || FALLBACK_IMG_URL}
            alt={place?.name}
          />
          <p className="text-sm text-gray-300 my-2">{place?.address}</p>
          <Button onClick={handleAddToAsset} block size="small" type="primary" className="mt-2">
            添加至要素
          </Button>
        </MapPanel>
      )}
    </div>
  );
};

export default Search;
