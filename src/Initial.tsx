import { observer } from "mobx-react-lite";
import { Flex, Typography } from "antd";
import { useEffect } from "react";
import { locales, modules } from "./modules";
import { initRouter } from "./router";
import { gstate } from "./global";
import { Indicator } from "./components/Indicator";
import { avifCheck } from "./engines/support";

const loadResources = () => {
  const loadList: Array<Promise<any>> = [
    import("jszip"),
    fetch(new URL("./engines/png.wasm", import.meta.url)),
    fetch(new URL("./engines/gif.wasm", import.meta.url)),
    fetch(new URL("./engines/avif.wasm", import.meta.url)),
    import("./engines/WorkerPreview?worker"),
    import("./engines/WorkerCompress?worker"),
  ];
  const langs = Object.values(locales);
  const pages = Object.values(modules);
  for (const load of [...langs, ...pages]) {
    loadList.push(load());
  }
  loadList.push(avifCheck());
  return Promise.all(loadList);
};

const useInit = () => {
  useEffect(() => {
    (async () => {
      await loadResources();
      initRouter();
    })();
  }, []);
};

export const Initial = observer(() => {
  useInit();

  return (
    <Flex align="center" justify="center" className="__initial">
      <Flex vertical align="center">
        <Indicator size="large" />
        <Typography.Text type="secondary">
          {gstate.locale?.initial}
        </Typography.Text>
      </Flex>
    </Flex>
  );
});
