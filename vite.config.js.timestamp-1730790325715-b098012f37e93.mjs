// vite.config.js
import { defineConfig } from "file:///D:/School/HK7/TLCN/Workspace/utez-react-app/node_modules/vite/dist/node/index.js";
import react from "file:///D:/School/HK7/TLCN/Workspace/utez-react-app/node_modules/@vitejs/plugin-react/dist/index.mjs";
var vite_config_default = defineConfig({
  plugins: [react()],
  server: {
    port: 3e3
  },
  resolve: {
    alias: {
      "@/": "/src/",
      "@components": "/src/components",
      "@layout": "/src/layout",
      "@ui": "/src/ui",
      "@pages": "/src/pages",
      "@assets": "/src/assets",
      "@styles": "/src/styles",
      "@db": "/src/db",
      "@hooks": "/src/hooks",
      "@fonts": "/src/fonts",
      "@utils": "/src/utils",
      "@widgets": "/src/widgets",
      "@contexts": "/src/contexts",
      "@constants": "/src/constants"
    }
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcuanMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJEOlxcXFxTY2hvb2xcXFxcSEs3XFxcXFRMQ05cXFxcV29ya3NwYWNlXFxcXHV0ZXotcmVhY3QtYXBwXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCJEOlxcXFxTY2hvb2xcXFxcSEs3XFxcXFRMQ05cXFxcV29ya3NwYWNlXFxcXHV0ZXotcmVhY3QtYXBwXFxcXHZpdGUuY29uZmlnLmpzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9EOi9TY2hvb2wvSEs3L1RMQ04vV29ya3NwYWNlL3V0ZXotcmVhY3QtYXBwL3ZpdGUuY29uZmlnLmpzXCI7aW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSAndml0ZSc7XHJcbmltcG9ydCByZWFjdCBmcm9tICdAdml0ZWpzL3BsdWdpbi1yZWFjdCc7XHJcbi8vIGh0dHBzOi8vdml0ZWpzLmRldi9jb25maWcvXHJcbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZyh7XHJcbiAgICBwbHVnaW5zOiBbcmVhY3QoKV0sXHJcbiAgICBzZXJ2ZXI6IHtcclxuICAgICAgICBwb3J0OiAzMDAwLFxyXG4gICAgfSxcclxuICAgIHJlc29sdmU6IHtcclxuICAgICAgICBhbGlhczoge1xyXG4gICAgICAgICAgICAnQC8nOiAnL3NyYy8nLFxyXG4gICAgICAgICAgICAnQGNvbXBvbmVudHMnOiAnL3NyYy9jb21wb25lbnRzJyxcclxuICAgICAgICAgICAgJ0BsYXlvdXQnOiAnL3NyYy9sYXlvdXQnLFxyXG4gICAgICAgICAgICAnQHVpJzogJy9zcmMvdWknLFxyXG4gICAgICAgICAgICAnQHBhZ2VzJzogJy9zcmMvcGFnZXMnLFxyXG4gICAgICAgICAgICAnQGFzc2V0cyc6ICcvc3JjL2Fzc2V0cycsXHJcbiAgICAgICAgICAgICdAc3R5bGVzJzogJy9zcmMvc3R5bGVzJyxcclxuICAgICAgICAgICAgJ0BkYic6ICcvc3JjL2RiJyxcclxuICAgICAgICAgICAgJ0Bob29rcyc6ICcvc3JjL2hvb2tzJyxcclxuICAgICAgICAgICAgJ0Bmb250cyc6ICcvc3JjL2ZvbnRzJyxcclxuICAgICAgICAgICAgJ0B1dGlscyc6ICcvc3JjL3V0aWxzJyxcclxuICAgICAgICAgICAgJ0B3aWRnZXRzJzogJy9zcmMvd2lkZ2V0cycsXHJcbiAgICAgICAgICAgICdAY29udGV4dHMnOiAnL3NyYy9jb250ZXh0cycsXHJcbiAgICAgICAgICAgICdAY29uc3RhbnRzJzogJy9zcmMvY29uc3RhbnRzJyxcclxuICAgICAgICB9LFxyXG4gICAgfSxcclxufSk7Il0sCiAgIm1hcHBpbmdzIjogIjtBQUErVCxTQUFTLG9CQUFvQjtBQUM1VixPQUFPLFdBQVc7QUFFbEIsSUFBTyxzQkFBUSxhQUFhO0FBQUEsRUFDeEIsU0FBUyxDQUFDLE1BQU0sQ0FBQztBQUFBLEVBQ2pCLFFBQVE7QUFBQSxJQUNKLE1BQU07QUFBQSxFQUNWO0FBQUEsRUFDQSxTQUFTO0FBQUEsSUFDTCxPQUFPO0FBQUEsTUFDSCxNQUFNO0FBQUEsTUFDTixlQUFlO0FBQUEsTUFDZixXQUFXO0FBQUEsTUFDWCxPQUFPO0FBQUEsTUFDUCxVQUFVO0FBQUEsTUFDVixXQUFXO0FBQUEsTUFDWCxXQUFXO0FBQUEsTUFDWCxPQUFPO0FBQUEsTUFDUCxVQUFVO0FBQUEsTUFDVixVQUFVO0FBQUEsTUFDVixVQUFVO0FBQUEsTUFDVixZQUFZO0FBQUEsTUFDWixhQUFhO0FBQUEsTUFDYixjQUFjO0FBQUEsSUFDbEI7QUFBQSxFQUNKO0FBQ0osQ0FBQzsiLAogICJuYW1lcyI6IFtdCn0K
