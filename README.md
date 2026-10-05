# 大都行記 · Yuan Dadu Voxel Atlas

元大都教學漫遊沙盤，以 Three.js 在瀏覽器呈現體素城市、文獻說明與互動探索。

**線上體驗：** https://yuan-dadu-voxel.pages.dev/

## 兩種體驗

- **演示模式**：七個主題取景、全城俯覽與史料查閱，適合課堂展示。
- **遊戲模式**：1.75 米旅人、第一／第三人稱、六章讀城任務、手冊與地名傳送。
- 手機支援左側類比搖桿、右側動作鍵及雙指移動／環顧，建議橫屏。

## 操作

- `W A S D` 移動；拖動鼠標環顧。
- `Shift` 跑步；飛行時下降。
- 空格跳躍；快速雙按切換飛行／落地；飛行時按住空格上升。
- `V` 切換人稱，`E` 交談，`J` 開啟手冊。
- 預設步行 10×、飛行 60×，可各自調整。
- 點擊地標可查看說明並傳送；再次點擊全城俯覽可返回漫遊。

## 歷史與復原邊界

本專案是教學與藝術示意，並非完整考古復原。外城、宮城尺度及十一門方位保留題給設定；文獻換算、形制參考及尚未確證的細部，均在頁面「史料與復原邊界」分別說明。

蕭牆採暗紫紅色系，參考李燮平〈「紫禁城」名稱始於何時〉（《紫禁城》1997 年第 4 期，第 28 頁）；具體色值、顏料與牆面做法仍為示意。宮殿、太廟、鐘樓及服飾的參考來源可在場景中查閱。

## 大明殿專項重構

大明殿改用專用的重檐廡殿模型：正面十二根柱形成十一間，北接七間柱廊、寢殿與香閣；前位補齊大明門、日精／月華門、鳳儀／麟瑞門、東文樓與西武樓、周廡及北側殿閣。演示模式第 05 項可切換近觀、工字形俯覽與全院格局。

依據使用者提供的研究，並核對[傅熹年復原圖（中國大運河博物館刊載）](https://www.grandcanalmuseum.cn/yunboxinwen/368.html)、[姜東成 2008，頁 10](https://www.dpm.org.cn/Uploads/File/pdf/89/09/cd/8909cda2e548e1e29d0925e0472ed488.pdf)、[晉宏逵，頁 24–25](https://img.dpm.org.cn/Uploads/file/2026/03/27/1774599462TyUSpvTZg218985.pdf)及《輟耕錄》《元故宮遺錄》。尺制、不等柱距、院落間距、瓦色與細部仍是可調的工作假設；白石欄僅採其中一種記載。完整邊界在網站「史料」中列明。

## 本機使用

無需建置。啟動任意靜態網頁伺服器，例如：

```sh
python3 -m http.server 8765
```

瀏覽器開啟 `http://localhost:8765/`。需要支援 WebGL 的現代瀏覽器，並連網載入固定版本的 Three.js、OrbitControls 與 three-mesh-bvh；不是完全離線版本。

## 檔案

- `index.html`：完整應用，包含程式、樣式與動態生成的材質。
- `Yuandadu_map.jpg`：本專案提供的地理參照圖；亦嵌入 HTML 供查閱。
- `.nojekyll`：保留的靜態網站相容檔案，Cloudflare Pages 無需此檔案。

## Cloudflare Pages 發布

正式網站由 Cloudflare Pages 託管，GitHub 保留原始碼並觸發自動部署。

- 專案：`yuan-dadu-voxel`
- 來源：`EltonQ3/yuan-dadu-voxel` 的 `main` 分支
- Framework preset：`None`
- Build command：`exit 0`
- Build output directory：`.`（儲存庫根目錄）

更新 `main` 分支後，Cloudflare 會自動重新發布。

外部引文、參考圖及第三方函式庫的權利依各自來源；本儲存庫沒有替第三方素材另行授權。

## 幾何與通行檢查

`tests/daming-geometry.mjs` 使用相同版本的 Three.js（0.170.0）與 three-mesh-bvh（0.8.3），直接擷取應用內的建模與碰撞函式，核對十一間柱網、七間後廊、前後銜接、文武樓方位、門洞、步行登階與柱體阻擋。

```sh
node tests/daming-geometry.mjs /path/to/node_modules
```
