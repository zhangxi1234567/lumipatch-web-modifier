if (!globalThis.__claudeWebModifierContentScriptLoaded) {
  globalThis.__claudeWebModifierContentScriptLoaded = true;

  (function () {
    const SAVED_STYLE_ID = "claude-web-modifier-saved-style";
    const PREVIEW_STYLE_ID = "claude-web-modifier-preview-style";
    const INLINE_STYLE_ID = "claude-web-modifier-inline-style";
    const INLINE_ROOT_ID = "claude-web-modifier-inline-root";
    const PICKER_ROOT_ID = "claude-web-modifier-picker-root";
    const DRAG_MODE_ROOT_ID = "claude-web-modifier-drag-mode-root";
    const THEME_SWITCH_GUARD_STYLE_ID = "claude-web-modifier-theme-switch-guard";
    const OWNED_ATTRIBUTE = "data-claude-web-modifier-owned";
    const PIN_SOURCE_ATTRIBUTE = "data-cwm-pin-source-selector";
    const PIN_PLACEHOLDER_ATTRIBUTE = "data-cwm-pinned-placeholder-for";
    const PIN_ADOPTED_PLACEHOLDER_ATTRIBUTE = "data-cwm-adopted-placeholder";
    const PIN_SUPPRESSED_DUPLICATE_ATTRIBUTE = "data-cwm-pin-suppressed-duplicate";
    const RUNTIME_MESSAGE_TIMEOUT_MS = 65000;
    const DRAG_LAYER_MIN = 1;
    const DRAG_LAYER_MAX = 9;
    const DRAG_LAYER_Z_INDEX_BASE = 2147483636;
    const PICKER_DRAG_THRESHOLD_PX = 16;
    const PICKER_POINT_MIN_DISTANCE_PX = 6;
    const PICKER_MAX_PATH_POINTS = 180;
    const PICKER_SAMPLE_GRID_STEP_PX = 28;
    const DEFAULT_CONTENT_SETTINGS = {
      enableMutationObserver: true
    };
const INLINE_THEME_TEMPLATES = [
  {
    "id": "saas_nebula_dark",
    "name": "星云深空 SaaS",
    "colors": {
      "bg": "#0B1020",
      "bgSoft": "#131A30",
      "card": "#171F38",
      "text": "#EAF0FF",
      "textMuted": "#9AA8CC",
      "accent": "#5B8CFF",
      "accentStrong": "#3B6FFF",
      "border": "#273152",
      "input": "#111933"
    }
  },
  {
    "id": "saas_air_light",
    "name": "云雾极简 SaaS",
    "colors": {
      "bg": "#F5F8FF",
      "bgSoft": "#ECF2FF",
      "card": "#FFFFFF",
      "text": "#15213B",
      "textMuted": "#62708F",
      "accent": "#3A7BFF",
      "accentStrong": "#1F5EEA",
      "border": "#D7E2FA",
      "input": "#F8FAFF"
    }
  },
  {
    "id": "saas_cobalt_mix",
    "name": "钴蓝混搭 SaaS",
    "colors": {
      "bg": "#111827",
      "bgSoft": "#1F2937",
      "card": "#F9FAFB",
      "text": "#0F172A",
      "textMuted": "#6B7280",
      "accent": "#2563EB",
      "accentStrong": "#1D4ED8",
      "border": "#CBD5E1",
      "input": "#FFFFFF"
    }
  },
  {
    "id": "fintech_onyx",
    "name": "黑曜金融",
    "colors": {
      "bg": "#0A0D14",
      "bgSoft": "#111722",
      "card": "#141C2B",
      "text": "#E6EEFF",
      "textMuted": "#8FA1C2",
      "accent": "#18C37E",
      "accentStrong": "#00A96B",
      "border": "#22304A",
      "input": "#10182A"
    }
  },
  {
    "id": "fintech_ice",
    "name": "冰川金融",
    "colors": {
      "bg": "#F3F8FC",
      "bgSoft": "#E8F1F9",
      "card": "#FFFFFF",
      "text": "#10243B",
      "textMuted": "#5D748C",
      "accent": "#0EA5E9",
      "accentStrong": "#0284C7",
      "border": "#D3E2EF",
      "input": "#F9FCFF"
    }
  },
  {
    "id": "fintech_emerald",
    "name": "祖母绿交易台",
    "colors": {
      "bg": "#081512",
      "bgSoft": "#10211D",
      "card": "#122723",
      "text": "#E8FFF7",
      "textMuted": "#91B8AC",
      "accent": "#2DD4A3",
      "accentStrong": "#10B981",
      "border": "#244039",
      "input": "#0F211D"
    }
  },
  {
    "id": "media_cinema_dark",
    "name": "影院夜幕",
    "colors": {
      "bg": "#0D0D10",
      "bgSoft": "#17171D",
      "card": "#1B1B23",
      "text": "#F3F4F8",
      "textMuted": "#A7A9B8",
      "accent": "#FF5C5C",
      "accentStrong": "#E63D3D",
      "border": "#2B2C38",
      "input": "#14151D"
    }
  },
  {
    "id": "media_paper_light",
    "name": "报刊留白",
    "colors": {
      "bg": "#FFFDF8",
      "bgSoft": "#F8F3E9",
      "card": "#FFFFFF",
      "text": "#1F1B16",
      "textMuted": "#6E665D",
      "accent": "#C2410C",
      "accentStrong": "#9A3412",
      "border": "#E7DED1",
      "input": "#FFFEFB"
    }
  },
  {
    "id": "media_pulse_mix",
    "name": "脉冲媒体混搭",
    "colors": {
      "bg": "#10131A",
      "bgSoft": "#1A2030",
      "card": "#F4F6FA",
      "text": "#111827",
      "textMuted": "#667085",
      "accent": "#7C3AED",
      "accentStrong": "#6D28D9",
      "border": "#CBD5E1",
      "input": "#FFFFFF"
    }
  },
  {
    "id": "design_canvas_dark",
    "name": "画布工具深色",
    "colors": {
      "bg": "#0B0F1A",
      "bgSoft": "#12192A",
      "card": "#151F33",
      "text": "#ECF2FF",
      "textMuted": "#9AA8C7",
      "accent": "#22D3EE",
      "accentStrong": "#06B6D4",
      "border": "#253352",
      "input": "#101A2F"
    }
  },
  {
    "id": "design_frost_light",
    "name": "霜白工具浅色",
    "colors": {
      "bg": "#F7FBFF",
      "bgSoft": "#EEF6FF",
      "card": "#FFFFFF",
      "text": "#11223A",
      "textMuted": "#5F7390",
      "accent": "#14B8A6",
      "accentStrong": "#0D9488",
      "border": "#D5E4F5",
      "input": "#FAFDFF"
    }
  },
  {
    "id": "design_neon_lab",
    "name": "霓虹实验室",
    "colors": {
      "bg": "#0A0B12",
      "bgSoft": "#151726",
      "card": "#1A1E31",
      "text": "#F2F5FF",
      "textMuted": "#9DA6C7",
      "accent": "#A3E635",
      "accentStrong": "#84CC16",
      "border": "#2D3452",
      "input": "#141B30"
    }
  },
  {
    "id": "luxury_obsidian_gold",
    "name": "黑金奢华",
    "colors": {
      "bg": "#0A0908",
      "bgSoft": "#141210",
      "card": "#191613",
      "text": "#F8F3E8",
      "textMuted": "#B7AA93",
      "accent": "#D4AF37",
      "accentStrong": "#B68D20",
      "border": "#342C22",
      "input": "#120F0C"
    }
  },
  {
    "id": "luxury_pearl_champagne",
    "name": "珍珠香槟",
    "colors": {
      "bg": "#FAF7F2",
      "bgSoft": "#F2ECE3",
      "card": "#FFFFFF",
      "text": "#2A221A",
      "textMuted": "#7D6F5D",
      "accent": "#C8A97E",
      "accentStrong": "#A88353",
      "border": "#E6DACA",
      "input": "#FFFCF7"
    }
  },
  {
    "id": "luxury_royal_plum",
    "name": "皇家梅紫",
    "colors": {
      "bg": "#120A16",
      "bgSoft": "#1E1226",
      "card": "#24182F",
      "text": "#F5ECFF",
      "textMuted": "#B49FC8",
      "accent": "#C084FC",
      "accentStrong": "#A855F7",
      "border": "#3A2750",
      "input": "#1A1127"
    }
  },
  {
    "id": "ecom_pop_coral",
    "name": "珊瑚潮流电商",
    "colors": {
      "bg": "#FFF7F5",
      "bgSoft": "#FFEDEA",
      "card": "#FFFFFF",
      "text": "#2A1A17",
      "textMuted": "#86615A",
      "accent": "#FF6B6B",
      "accentStrong": "#F04444",
      "border": "#FFD3CE",
      "input": "#FFFDFC"
    }
  },
  {
    "id": "ecom_mint_fresh",
    "name": "薄荷新零售",
    "colors": {
      "bg": "#F3FFF9",
      "bgSoft": "#E7FBEF",
      "card": "#FFFFFF",
      "text": "#12251D",
      "textMuted": "#557569",
      "accent": "#22C55E",
      "accentStrong": "#16A34A",
      "border": "#CDEFD9",
      "input": "#FAFFFC"
    }
  },
  {
    "id": "ecom_noir_fashion",
    "name": "时尚黑白店铺",
    "colors": {
      "bg": "#0F1012",
      "bgSoft": "#181A1F",
      "card": "#F7F7F8",
      "text": "#121418",
      "textMuted": "#6C7280",
      "accent": "#FF3366",
      "accentStrong": "#E11D48",
      "border": "#D4D8E0",
      "input": "#FFFFFF"
    }
  },
  {
    "id": "mix_dusk_dawn",
    "name": "暮晓混搭",
    "colors": {
      "bg": "#1A1B2F",
      "bgSoft": "#252843",
      "card": "#FFF7E8",
      "text": "#2A1E10",
      "textMuted": "#7D6B57",
      "accent": "#F59E0B",
      "accentStrong": "#D97706",
      "border": "#E9D7BC",
      "input": "#FFFDF8"
    }
  },
  {
    "id": "mix_teal_sand",
    "name": "青沙混搭",
    "colors": {
      "bg": "#0F1F24",
      "bgSoft": "#193038",
      "card": "#F8F3E7",
      "text": "#1E1D1A",
      "textMuted": "#6E6A61",
      "accent": "#14B8A6",
      "accentStrong": "#0F766E",
      "border": "#DDD4C1",
      "input": "#FFFDF7"
    }
  },
  {
    "id": "mix_ink_sky",
    "name": "墨蓝晴空",
    "colors": {
      "bg": "#111827",
      "bgSoft": "#1F2937",
      "card": "#EAF4FF",
      "text": "#102033",
      "textMuted": "#5A7089",
      "accent": "#0EA5E9",
      "accentStrong": "#0369A1",
      "border": "#C6DCEF",
      "input": "#F7FCFF"
    }
  },
  {
    "id": "saas_graphite_blue",
    "name": "石墨蓝企业版",
    "colors": {
      "bg": "#14171F",
      "bgSoft": "#1C2230",
      "card": "#232C3D",
      "text": "#EDF2FF",
      "textMuted": "#9EABC5",
      "accent": "#4F7CFF",
      "accentStrong": "#315FE8",
      "border": "#33415C",
      "input": "#1A2438"
    }
  },
  {
    "id": "saas_lime_clean",
    "name": "柠净办公",
    "colors": {
      "bg": "#FBFFF5",
      "bgSoft": "#F2FBE5",
      "card": "#FFFFFF",
      "text": "#1A2312",
      "textMuted": "#667356",
      "accent": "#84CC16",
      "accentStrong": "#65A30D",
      "border": "#E0EDC8",
      "input": "#FEFFF9"
    }
  },
  {
    "id": "fintech_midnight_blue",
    "name": "午夜蓝投研",
    "colors": {
      "bg": "#081225",
      "bgSoft": "#101E36",
      "card": "#142744",
      "text": "#EAF2FF",
      "textMuted": "#95A8C8",
      "accent": "#38BDF8",
      "accentStrong": "#0EA5E9",
      "border": "#284569",
      "input": "#0F213F"
    }
  },
  {
    "id": "fintech_slate_green",
    "name": "石板绿风控",
    "colors": {
      "bg": "#0E1715",
      "bgSoft": "#172320",
      "card": "#1E2D29",
      "text": "#EAF8F3",
      "textMuted": "#93AAA2",
      "accent": "#34D399",
      "accentStrong": "#10B981",
      "border": "#334740",
      "input": "#162521"
    }
  },
  {
    "id": "media_violet_night",
    "name": "紫夜内容站",
    "colors": {
      "bg": "#120F22",
      "bgSoft": "#1D1833",
      "card": "#241F3C",
      "text": "#F3EEFF",
      "textMuted": "#B0A5CB",
      "accent": "#8B5CF6",
      "accentStrong": "#7C3AED",
      "border": "#3A3158",
      "input": "#1A1631"
    }
  },
  {
    "id": "media_sunrise_editorial",
    "name": "日出版面",
    "colors": {
      "bg": "#FFF9F2",
      "bgSoft": "#FFF1E4",
      "card": "#FFFFFF",
      "text": "#2B1B12",
      "textMuted": "#896454",
      "accent": "#F97316",
      "accentStrong": "#EA580C",
      "border": "#F2D8C0",
      "input": "#FFFEFB"
    }
  },
  {
    "id": "design_orange_studio",
    "name": "橙域创作台",
    "colors": {
      "bg": "#1A120D",
      "bgSoft": "#281B14",
      "card": "#322218",
      "text": "#FFF2E8",
      "textMuted": "#C8A793",
      "accent": "#FB923C",
      "accentStrong": "#F97316",
      "border": "#4A3325",
      "input": "#24180F"
    }
  },
  {
    "id": "design_cyan_grid",
    "name": "青网格设计",
    "colors": {
      "bg": "#F0FCFF",
      "bgSoft": "#E0F7FA",
      "card": "#FFFFFF",
      "text": "#0B2630",
      "textMuted": "#4F6D76",
      "accent": "#06B6D4",
      "accentStrong": "#0891B2",
      "border": "#BFEAF2",
      "input": "#F8FEFF"
    }
  },
  {
    "id": "luxury_black_titanium",
    "name": "钛黑奢品",
    "colors": {
      "bg": "#090A0C",
      "bgSoft": "#111419",
      "card": "#161B22",
      "text": "#F2F4F8",
      "textMuted": "#A5AFBE",
      "accent": "#9CA3AF",
      "accentStrong": "#6B7280",
      "border": "#2A313D",
      "input": "#0F141B"
    }
  },
  {
    "id": "luxury_ivory_black",
    "name": "象牙黑混奢",
    "colors": {
      "bg": "#F9F6EF",
      "bgSoft": "#EFE8DB",
      "card": "#171717",
      "text": "#F8F3E7",
      "textMuted": "#B5A995",
      "accent": "#D4B483",
      "accentStrong": "#B08A57",
      "border": "#3A332A",
      "input": "#121212"
    }
  },
  {
    "id": "ecom_candy_pop",
    "name": "糖果潮玩电商",
    "colors": {
      "bg": "#FFF8FE",
      "bgSoft": "#FFEFFC",
      "card": "#FFFFFF",
      "text": "#2B1024",
      "textMuted": "#8A5D7D",
      "accent": "#EC4899",
      "accentStrong": "#DB2777",
      "border": "#F7CFE8",
      "input": "#FFFDFF"
    }
  },
  {
    "id": "ecom_earthy_market",
    "name": "大地市集电商",
    "colors": {
      "bg": "#FAF7F0",
      "bgSoft": "#F0E8D9",
      "card": "#FFFFFF",
      "text": "#2D241A",
      "textMuted": "#7D705E",
      "accent": "#A16207",
      "accentStrong": "#854D0E",
      "border": "#E0D2B9",
      "input": "#FEFCF7"
    }
  },
  {
    "id": "ecom_glacier_blue",
    "name": "冰川蓝商城",
    "colors": {
      "bg": "#F3FAFF",
      "bgSoft": "#E6F3FF",
      "card": "#FFFFFF",
      "text": "#10243A",
      "textMuted": "#5A738E",
      "accent": "#3B82F6",
      "accentStrong": "#2563EB",
      "border": "#CFE1F7",
      "input": "#FAFDFF"
    }
  },
  {
    "id": "mix_charcoal_rose",
    "name": "炭灰玫瑰",
    "colors": {
      "bg": "#1A171B",
      "bgSoft": "#27212A",
      "card": "#FFF1F6",
      "text": "#2B1420",
      "textMuted": "#86606F",
      "accent": "#E11D48",
      "accentStrong": "#BE123C",
      "border": "#EDCBD8",
      "input": "#FFF9FB"
    }
  },
  {
    "id": "mix_navy_latte",
    "name": "海军拿铁",
    "colors": {
      "bg": "#101828",
      "bgSoft": "#1B2A3F",
      "card": "#F6EFE6",
      "text": "#2A2118",
      "textMuted": "#7A6A58",
      "accent": "#0EA5A4",
      "accentStrong": "#0F766E",
      "border": "#DECFBF",
      "input": "#FFFDF9"
    }
  },
  {
    "id": "mix_forest_fog",
    "name": "森林薄雾",
    "colors": {
      "bg": "#0E1A14",
      "bgSoft": "#16261E",
      "card": "#EDF7F1",
      "text": "#13261C",
      "textMuted": "#5A7868",
      "accent": "#22C55E",
      "accentStrong": "#15803D",
      "border": "#C9E2D4",
      "input": "#F8FFFB"
    }
  },
  {
    "id": "mix_ruby_smoke",
    "name": "红宝烟灰",
    "colors": {
      "bg": "#1B1316",
      "bgSoft": "#281B20",
      "card": "#F7F3F4",
      "text": "#24171C",
      "textMuted": "#76626A",
      "accent": "#DC2626",
      "accentStrong": "#B91C1C",
      "border": "#DCCFD4",
      "input": "#FFFFFF"
    }
  },
  {
    "id": "mix_ocean_pearl",
    "name": "海珠混搭",
    "colors": {
      "bg": "#0F2230",
      "bgSoft": "#183448",
      "card": "#F4FBFF",
      "text": "#102838",
      "textMuted": "#5A7588",
      "accent": "#06B6D4",
      "accentStrong": "#0E7490",
      "border": "#C8DFEC",
      "input": "#FCFEFF"
    }
  },
  {
    "id": "mix_mono_future",
    "name": "未来黑白",
    "colors": {
      "bg": "#0E0E10",
      "bgSoft": "#191A1E",
      "card": "#FFFFFF",
      "text": "#111217",
      "textMuted": "#666C78",
      "accent": "#52525B",
      "accentStrong": "#27272A",
      "border": "#D4D7DE",
      "input": "#F8F9FB"
    }
  },
  {
    "id": "saas_solar_teal",
    "name": "日曜青 SaaS",
    "colors": {
      "bg": "#F8FFFD",
      "bgSoft": "#EAFBF7",
      "card": "#FFFFFF",
      "text": "#10251F",
      "textMuted": "#5C776D",
      "accent": "#14B8A6",
      "accentStrong": "#0F766E",
      "border": "#CDEDE4",
      "input": "#FCFFFE"
    }
  },
  {
    "id": "soft_mist_blue_pink",
    "name": "柔雾蓝粉",
    "colors": {
      "bg": "#F7FAFF",
      "bgSoft": "#F1F3FF",
      "card": "#E9EEFF",
      "text": "#212A45",
      "textMuted": "#687298",
      "accent": "#90B4FF",
      "accentStrong": "#D89ABF",
      "border": "#D4DCF3",
      "input": "#FCFDFF"
    }
  },
  {
    "id": "soft_milk_lavender",
    "name": "奶雾薰衣草",
    "colors": {
      "bg": "#FAF7FF",
      "bgSoft": "#F1EBFF",
      "card": "#F7F1FF",
      "text": "#2D2442",
      "textMuted": "#7D7399",
      "accent": "#B79CFF",
      "accentStrong": "#9D7EFF",
      "border": "#DDD2F4",
      "input": "#FCF9FF"
    }
  },
  {
    "id": "soft_peach_cloud",
    "name": "蜜桃云朵",
    "colors": {
      "bg": "#FFF9F6",
      "bgSoft": "#FFEFE7",
      "card": "#FFE9DC",
      "text": "#3A2A24",
      "textMuted": "#8C6E63",
      "accent": "#FFB08A",
      "accentStrong": "#F0926B",
      "border": "#F5D7C7",
      "input": "#FFFDFC"
    }
  },
  {
    "id": "soft_mint_fog",
    "name": "薄荷轻雾",
    "colors": {
      "bg": "#F6FFFB",
      "bgSoft": "#E9FBF3",
      "card": "#DFF5EA",
      "text": "#20332C",
      "textMuted": "#628074",
      "accent": "#7DDDB8",
      "accentStrong": "#56CDA1",
      "border": "#CFEBDD",
      "input": "#FBFFFD"
    }
  },
  {
    "id": "soft_powder_blue",
    "name": "粉雾浅蓝",
    "colors": {
      "bg": "#F6FAFF",
      "bgSoft": "#EAF2FF",
      "card": "#DDEBFF",
      "text": "#1F2E46",
      "textMuted": "#5E7498",
      "accent": "#90B8FF",
      "accentStrong": "#6F9BEE",
      "border": "#CBDBF3",
      "input": "#FBFDFF"
    }
  },
  {
    "id": "soft_rosewater",
    "name": "玫瑰水",
    "colors": {
      "bg": "#FFF7FA",
      "bgSoft": "#FFEAF1",
      "card": "#FFDDE9",
      "text": "#3A2330",
      "textMuted": "#8C6475",
      "accent": "#F8A8C6",
      "accentStrong": "#EB86AF",
      "border": "#F2CFDE",
      "input": "#FFFDFE"
    }
  },
  {
    "id": "soft_warm_sand",
    "name": "暖沙奶油",
    "colors": {
      "bg": "#FFFCF6",
      "bgSoft": "#F9F1E5",
      "card": "#F1E2CC",
      "text": "#332A1E",
      "textMuted": "#7C6B56",
      "accent": "#D9B889",
      "accentStrong": "#BF9A66",
      "border": "#E7D6BE",
      "input": "#FFFDF9"
    }
  },
  {
    "id": "soft_lilac_sky",
    "name": "丁香晴空",
    "colors": {
      "bg": "#F8F7FF",
      "bgSoft": "#ECEBFF",
      "card": "#E1DFFE",
      "text": "#282643",
      "textMuted": "#6C6A97",
      "accent": "#A7A2FF",
      "accentStrong": "#8982F0",
      "border": "#D4D2F0",
      "input": "#FCFBFF"
    }
  },
  {
    "id": "soft_pistachio_cream",
    "name": "开心果奶霜",
    "colors": {
      "bg": "#FBFFF5",
      "bgSoft": "#F1F9E5",
      "card": "#E7F1D3",
      "text": "#2A331E",
      "textMuted": "#6A7D56",
      "accent": "#B7D08A",
      "accentStrong": "#9BBB65",
      "border": "#DDE9C6",
      "input": "#FEFFF9"
    }
  },
  {
    "id": "soft_ocean_milk",
    "name": "海盐奶蓝",
    "colors": {
      "bg": "#F7FCFF",
      "bgSoft": "#E8F6FF",
      "card": "#D9EEFF",
      "text": "#1E3142",
      "textMuted": "#5C7D94",
      "accent": "#8FCFFF",
      "accentStrong": "#69B6EE",
      "border": "#CAE2F4",
      "input": "#FBFEFF"
    }
  },
  {
    "id": "soft_blush_beige",
    "name": "豆沙米杏",
    "colors": {
      "bg": "#FFF9F8",
      "bgSoft": "#F8EFEC",
      "card": "#EEDFD9",
      "text": "#352824",
      "textMuted": "#7D635D",
      "accent": "#D9ADA1",
      "accentStrong": "#C58D80",
      "border": "#E4D2CB",
      "input": "#FFFDFC"
    }
  },
  {
    "id": "dynamic_ocean_tide",
    "name": "海流微澜（动态）",
    "dynamicBackground": "ocean",
    "colors": {
      "bg": "#ECF8FF",
      "bgSoft": "#DFF2FF",
      "card": "#F5FBFF",
      "text": "#173345",
      "textMuted": "#56778D",
      "accent": "#69B6EE",
      "accentStrong": "#3F93CF",
      "border": "#C5E2F2",
      "input": "#F9FDFF"
    }
  },
  {
    "id": "dynamic_aurora_mint",
    "name": "薄荷极光（动态）",
    "dynamicBackground": "aurora",
    "colors": {
      "bg": "#F2FFFA",
      "bgSoft": "#E2F9F1",
      "card": "#F7FFFC",
      "text": "#17342A",
      "textMuted": "#5A7D6E",
      "accent": "#58D1B1",
      "accentStrong": "#2FA98B",
      "border": "#CDEEE3",
      "input": "#FCFFFE"
    }
  },
  {
    "id": "dynamic_qq_pulse",
    "name": "乐律青波（动态）",
    "dynamicBackground": "music",
    "colors": {
      "bg": "#F4FFF8",
      "bgSoft": "#E7FCEF",
      "card": "#F8FFFB",
      "text": "#153126",
      "textMuted": "#587768",
      "accent": "#31C27C",
      "accentStrong": "#219B63",
      "border": "#D1EFDf",
      "input": "#FCFFFD"
    }
  },
  {
    "id": "dynamic_dusk_violet",
    "name": "暮雾紫岚（动态）",
    "dynamicBackground": "dusk",
    "colors": {
      "bg": "#F7F6FF",
      "bgSoft": "#ECE9FF",
      "card": "#F9F8FF",
      "text": "#2A2343",
      "textMuted": "#736C95",
      "accent": "#9D8CF2",
      "accentStrong": "#7E6BDC",
      "border": "#D9D4F2",
      "input": "#FDFDFF"
    }
  }
];
    const INLINE_COMPONENT_TEMPLATES = [
      {
        id: "aurora_lift_button",
        name: "Aurora Lift 按钮",
        category: "button",
        keywords: ["shadcn", "gradient", "hero", "cta", "blue"],
        html: `<button type="button" style="position: relative; border: 0; border-radius: 16px; padding: 11px 18px; font-weight: 700; letter-spacing: 0.01em; color: #ffffff; background: linear-gradient(135deg,#2563eb 0%,#7c3aed 55%,#ec4899 100%); box-shadow: 0 14px 30px rgba(76,29,149,0.28), inset 0 1px 0 rgba(255,255,255,0.24); cursor: pointer;">{{content}}</button>`
      },
      {
        id: "glass_tint_button",
        name: "Glass Tint 按钮",
        category: "button",
        keywords: ["magicui", "glass", "soft", "light", "frosted"],
        html: `<button type="button" style="border: 1px solid rgba(148,163,184,0.35); border-radius: 16px; padding: 11px 18px; font-weight: 700; color: #0f172a; background: linear-gradient(180deg,rgba(255,255,255,0.88),rgba(241,245,249,0.9)); backdrop-filter: blur(12px); box-shadow: 0 12px 32px rgba(15,23,42,0.12), inset 0 1px 0 rgba(255,255,255,0.88); cursor: pointer;">{{content}}</button>`
      },
      {
        id: "obsidian_edge_button",
        name: "Obsidian Edge 按钮",
        category: "button",
        keywords: ["dark", "luxury", "elevated", "premium", "black"],
        html: `<button type="button" style="border: 1px solid rgba(71,85,105,0.8); border-radius: 16px; padding: 11px 18px; font-weight: 700; color: #f8fafc; background: linear-gradient(180deg,#1e293b 0%,#0f172a 100%); box-shadow: 0 14px 34px rgba(15,23,42,0.34), inset 0 1px 0 rgba(255,255,255,0.08); cursor: pointer;">{{content}}</button>`
      },
      {
        id: "peach_pop_button",
        name: "Peach Pop 按钮",
        category: "button",
        keywords: ["warm", "daisyui", "pastel", "orange", "friendly"],
        html: `<button type="button" style="border: 0; border-radius: 999px; padding: 11px 18px; font-weight: 800; color: #7c2d12; background: linear-gradient(135deg,#fdba74 0%,#fb7185 100%); box-shadow: 0 12px 28px rgba(251,113,133,0.28); cursor: pointer;">{{content}}</button>`
      },
      {
        id: "mint_outline_button",
        name: "Mint Outline 按钮",
        category: "button",
        keywords: ["outline", "clean", "mint", "saas", "light"],
        html: `<button type="button" style="border: 1.5px solid #99f6e4; border-radius: 14px; padding: 10px 17px; font-weight: 700; color: #115e59; background: linear-gradient(180deg,#f0fdfa 0%,#ccfbf1 100%); box-shadow: inset 0 1px 0 rgba(255,255,255,0.9), 0 10px 24px rgba(20,184,166,0.16); cursor: pointer;">{{content}}</button>`
      },
      {
        id: "command_bar_input",
        name: "Command Bar 输入框",
        category: "input",
        keywords: ["search", "shadcn", "palette", "command", "desktop"],
        html: `<input type="text" placeholder="{{content}}" style="width: 100%; max-width: 440px; border: 1px solid #dbe4f0; border-radius: 16px; padding: 12px 14px; background: linear-gradient(180deg,#ffffff 0%,#f8fafc 100%); color: #0f172a; box-shadow: 0 14px 30px rgba(15,23,42,0.08), inset 0 1px 0 rgba(255,255,255,0.95);" />`
      },
      {
        id: "glass_search_input",
        name: "Glass Search 输入框",
        category: "input",
        keywords: ["glass", "magicui", "blur", "search", "floating"],
        html: `<input type="search" placeholder="{{content}}" style="width: 100%; max-width: 440px; border: 1px solid rgba(191,219,254,0.65); border-radius: 18px; padding: 12px 14px; background: linear-gradient(180deg,rgba(255,255,255,0.78),rgba(239,246,255,0.82)); backdrop-filter: blur(12px); color: #0f172a; box-shadow: 0 18px 36px rgba(37,99,235,0.12), inset 0 1px 0 rgba(255,255,255,0.92);" />`
      },
      {
        id: "editor_line_input",
        name: "Editor Line 输入框",
        category: "input",
        keywords: ["minimal", "linear", "editor", "underline", "clean"],
        html: `<input type="text" placeholder="{{content}}" style="width: 100%; max-width: 440px; border: 0; border-bottom: 2px solid #cbd5e1; border-radius: 0; padding: 10px 2px; background: transparent; color: #0f172a; box-shadow: none;" />`
      },
      {
        id: "pearl_email_input",
        name: "Pearl Mail 输入框",
        category: "input",
        keywords: ["email", "soft", "warm", "pearl", "form"],
        html: `<input type="email" placeholder="{{content}}" style="width: 100%; max-width: 440px; border: 1px solid #eadfd7; border-radius: 15px; padding: 12px 14px; background: linear-gradient(180deg,#fffdfb 0%,#fff7ed 100%); color: #3f2d26; box-shadow: 0 12px 28px rgba(157,23,77,0.08), inset 0 1px 0 rgba(255,255,255,0.92);" />`
      },
      {
        id: "obsidian_terminal_input",
        name: "Obsidian Terminal 输入框",
        category: "input",
        keywords: ["dark", "terminal", "console", "code", "black"],
        html: `<input type="text" placeholder="{{content}}" style="width: 100%; max-width: 440px; border: 1px solid #334155; border-radius: 14px; padding: 12px 14px; background: linear-gradient(180deg,#0f172a 0%,#111827 100%); color: #e2e8f0; box-shadow: inset 0 1px 0 rgba(255,255,255,0.05), 0 14px 30px rgba(2,6,23,0.28);" />`
      },
      {
        id: "bento_spotlight_card",
        name: "Bento Spotlight 卡片",
        category: "card",
        keywords: ["bento", "dashboard", "spotlight", "shadcn", "grid"],
        html: `<article style="border: 1px solid #dbeafe; border-radius: 22px; background: radial-gradient(circle at top right,#dbeafe 0%,#eff6ff 20%,#ffffff 58%); padding: 18px; box-shadow: 0 24px 56px rgba(59,130,246,0.14);"><p style="margin: 0 0 8px; color: #2563eb; font-size: 12px; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase;">Spotlight</p><div style="margin: 0; color: #0f172a; font-size: 15px; line-height: 1.65; font-weight: 650;">{{content}}</div></article>`
      },
      {
        id: "editorial_card",
        name: "Editorial Surface 卡片",
        category: "card",
        keywords: ["editorial", "article", "premium", "cream", "mamba"],
        html: `<article style="border: 1px solid #efe6d7; border-radius: 20px; background: linear-gradient(180deg,#fffdfa 0%,#fff7ed 100%); padding: 20px; box-shadow: 0 18px 46px rgba(120,53,15,0.09);"><p style="margin: 0 0 10px; color: #b45309; font-size: 11px; font-weight: 800; letter-spacing: 0.12em; text-transform: uppercase;">Feature</p><div style="margin: 0; color: #3f2d26; font-size: 16px; line-height: 1.7; font-weight: 600;">{{content}}</div></article>`
      },
      {
        id: "obsidian_panel_card",
        name: "Obsidian Panel 卡片",
        category: "card",
        keywords: ["dark", "panel", "dashboard", "luxury", "slate"],
        html: `<article style="border: 1px solid rgba(71,85,105,0.85); border-radius: 20px; background: linear-gradient(180deg,#111827 0%,#0f172a 100%); padding: 18px; box-shadow: 0 22px 48px rgba(2,6,23,0.34), inset 0 1px 0 rgba(255,255,255,0.05);"><p style="margin: 0 0 8px; color: #93c5fd; font-size: 12px; letter-spacing: 0.1em; text-transform: uppercase;">Panel</p><div style="margin: 0; color: #f8fafc; font-size: 15px; line-height: 1.65; font-weight: 600;">{{content}}</div></article>`
      },
      {
        id: "glass_float_card",
        name: "Glass Float 卡片",
        category: "card",
        keywords: ["glass", "magicui", "floating", "soft", "blur"],
        html: `<article style="border: 1px solid rgba(255,255,255,0.68); border-radius: 22px; background: linear-gradient(180deg,rgba(255,255,255,0.72),rgba(241,245,249,0.84)); backdrop-filter: blur(18px); padding: 18px; box-shadow: 0 24px 48px rgba(15,23,42,0.12);"><p style="margin: 0 0 8px; color: #6366f1; font-size: 12px; font-weight: 700;">Glass Layer</p><div style="margin: 0; color: #0f172a; font-size: 15px; line-height: 1.65; font-weight: 600;">{{content}}</div></article>`
      },
      {
        id: "metric_orbit_card",
        name: "Metric Orbit 卡片",
        category: "card",
        keywords: ["metric", "stat", "analytics", "blue", "dashboard"],
        html: `<article style="border: 1px solid #c7d2fe; border-radius: 20px; background: linear-gradient(135deg,#eef2ff 0%,#ffffff 100%); padding: 18px; box-shadow: 0 18px 42px rgba(99,102,241,0.16);"><p style="margin: 0; color: #4f46e5; font-size: 12px; font-weight: 700;">Live Metric</p><div style="margin: 10px 0 0; color: #111827; font-size: 26px; line-height: 1.2; font-weight: 800;">{{content}}</div></article>`
      },
      {
        id: "linen_story_card",
        name: "Linen Story 卡片",
        category: "card",
        keywords: ["story", "soft", "magazine", "paper", "warm"],
        html: `<article style="border: 1px solid #e7ddd0; border-radius: 22px; background: linear-gradient(180deg,#fffefb 0%,#f8f1e7 100%); padding: 20px; box-shadow: 0 18px 38px rgba(146,64,14,0.08);"><div style="margin: 0; color: #5b4636; font-size: 15px; line-height: 1.75; font-weight: 500;">{{content}}</div></article>`
      },
      {
        id: "signal_badge",
        name: "Signal Badge 标签",
        category: "badge",
        keywords: ["status", "green", "live", "pill", "indicator"],
        html: `<span style="display: inline-flex; align-items: center; gap: 8px; padding: 5px 11px; border-radius: 999px; background: linear-gradient(135deg,#ecfdf5,#d1fae5); color: #166534; border: 1px solid rgba(16,185,129,0.28); font-size: 12px; font-weight: 800;"><span style="width: 8px; height: 8px; border-radius: 999px; background: #22c55e; box-shadow: 0 0 0 4px rgba(34,197,94,0.16);"></span>{{content}}</span>`
      },
      {
        id: "violet_pill_badge",
        name: "Violet Pill 标签",
        category: "badge",
        keywords: ["pill", "violet", "soft", "daisyui", "tag"],
        html: `<span style="display: inline-flex; align-items: center; padding: 5px 11px; border-radius: 999px; background: linear-gradient(135deg,#ede9fe,#ddd6fe); color: #5b21b6; border: 1px solid rgba(139,92,246,0.22); font-size: 12px; font-weight: 800;">{{content}}</span>`
      },
      {
        id: "pearl_outline_badge",
        name: "Pearl Outline 标签",
        category: "badge",
        keywords: ["neutral", "minimal", "soft", "outline", "clean"],
        html: `<span style="display: inline-flex; align-items: center; padding: 5px 11px; border-radius: 999px; background: #ffffff; color: #475569; border: 1px solid #dbe4ee; box-shadow: 0 8px 18px rgba(15,23,42,0.05); font-size: 12px; font-weight: 700;">{{content}}</span>`
      },
      {
        id: "sunset_badge",
        name: "Sunset Glow 标签",
        category: "badge",
        keywords: ["warm", "sunset", "orange", "pink", "highlight"],
        html: `<span style="display: inline-flex; align-items: center; padding: 5px 11px; border-radius: 999px; background: linear-gradient(135deg,#ffedd5,#fbcfe8); color: #9a3412; border: 1px solid rgba(251,146,60,0.25); font-size: 12px; font-weight: 800;">{{content}}</span>`
      },
      {
        id: "command_select",
        name: "Command Select 下拉",
        category: "select",
        keywords: ["select", "shadcn", "panel", "clean", "desktop"],
        html: `<select style="width: 100%; max-width: 320px; border: 1px solid #dbe4f0; border-radius: 15px; padding: 11px 12px; background: linear-gradient(180deg,#ffffff 0%,#f8fafc 100%); color: #0f172a; box-shadow: 0 12px 28px rgba(15,23,42,0.08);"><option>{{content}}</option><option>选项 2</option><option>选项 3</option></select>`
      },
      {
        id: "glass_select",
        name: "Glass Select 下拉",
        category: "select",
        keywords: ["glass", "magicui", "blur", "soft", "floating"],
        html: `<select style="width: 100%; max-width: 320px; border: 1px solid rgba(191,219,254,0.75); border-radius: 16px; padding: 11px 12px; background: linear-gradient(180deg,rgba(255,255,255,0.8),rgba(239,246,255,0.86)); backdrop-filter: blur(12px); color: #1e3a8a; box-shadow: 0 16px 34px rgba(37,99,235,0.14);"><option>{{content}}</option><option>探索</option><option>归档</option></select>`
      },
      {
        id: "ink_select",
        name: "Ink Select 下拉",
        category: "select",
        keywords: ["dark", "select", "ink", "premium", "black"],
        html: `<select style="width: 100%; max-width: 320px; border: 1px solid #334155; border-radius: 15px; padding: 11px 12px; background: linear-gradient(180deg,#111827 0%,#0f172a 100%); color: #e2e8f0; box-shadow: inset 0 1px 0 rgba(255,255,255,0.05), 0 16px 34px rgba(2,6,23,0.3);"><option>{{content}}</option><option>深色</option><option>高对比</option></select>`
      },
      {
        id: "pearl_select",
        name: "Pearl Select 下拉",
        category: "select",
        keywords: ["warm", "soft", "beige", "form", "elegant"],
        html: `<select style="width: 100%; max-width: 320px; border: 1px solid #eadfd7; border-radius: 15px; padding: 11px 12px; background: linear-gradient(180deg,#fffdfb 0%,#fff7ed 100%); color: #7c2d12; box-shadow: 0 12px 28px rgba(154,52,18,0.08);"><option>{{content}}</option><option>默认</option><option>高级</option></select>`
      },
      {
        id: "royal_glow_button",
        name: "Royal Glow 按钮",
        category: "button",
        keywords: ["premium", "violet", "neon", "magicui", "glow"],
        html: `<button type="button" style="border: 1px solid rgba(196,181,253,0.45); border-radius: 16px; padding: 11px 18px; font-weight: 800; color: #f5f3ff; background: linear-gradient(135deg,#4c1d95 0%,#7c3aed 55%,#6366f1 100%); box-shadow: 0 0 0 1px rgba(255,255,255,0.08) inset, 0 16px 36px rgba(91,33,182,0.42), 0 0 28px rgba(129,140,248,0.38); cursor: pointer;">{{content}}</button>`
      },
      {
        id: "mono_press_button",
        name: "Mono Press 按钮",
        category: "button",
        keywords: ["minimal", "editorial", "mono", "clean", "shadcn"],
        html: `<button type="button" style="border: 1.5px solid #0f172a; border-radius: 12px; padding: 10px 17px; font-weight: 700; color: #0f172a; background: #ffffff; box-shadow: 4px 4px 0 #0f172a; cursor: pointer;">{{content}}</button>`
      },
      {
        id: "lime_energy_button",
        name: "Lime Energy 按钮",
        category: "button",
        keywords: ["fresh", "sport", "lime", "vivid", "cta"],
        html: `<button type="button" style="border: 0; border-radius: 14px; padding: 11px 18px; font-weight: 800; color: #052e16; background: linear-gradient(135deg,#bef264 0%,#4ade80 100%); box-shadow: 0 14px 30px rgba(34,197,94,0.35); cursor: pointer;">{{content}}</button>`
      },
      {
        id: "ink_outline_button",
        name: "Ink Outline 按钮",
        category: "button",
        keywords: ["dark", "outline", "enterprise", "neutral", "panel"],
        html: `<button type="button" style="border: 1px solid #334155; border-radius: 14px; padding: 10px 17px; font-weight: 700; color: #cbd5e1; background: linear-gradient(180deg,#0b1220 0%,#0f172a 100%); box-shadow: inset 0 1px 0 rgba(255,255,255,0.06); cursor: pointer;">{{content}}</button>`
      },
      {
        id: "aurora_textarea_input",
        name: "Aurora Textarea 输入框",
        category: "input",
        keywords: ["textarea", "gradient", "soft", "studio", "premium"],
        html: `<textarea placeholder="{{content}}" style="width: 100%; max-width: 460px; min-height: 108px; border: 1px solid #c7d2fe; border-radius: 16px; padding: 12px 14px; background: linear-gradient(180deg,#eef2ff 0%,#ffffff 100%); color: #1e1b4b; box-shadow: 0 14px 34px rgba(79,70,229,0.14); resize: vertical;"></textarea>`
      },
      {
        id: "mint_frost_input",
        name: "Mint Frost 输入框",
        category: "input",
        keywords: ["mint", "glass", "frosted", "light", "fresh"],
        html: `<input type="text" placeholder="{{content}}" style="width: 100%; max-width: 440px; border: 1px solid rgba(167,243,208,0.8); border-radius: 16px; padding: 12px 14px; background: linear-gradient(180deg,rgba(240,253,250,0.95),rgba(220,252,231,0.85)); color: #064e3b; box-shadow: 0 12px 30px rgba(16,185,129,0.12), inset 0 1px 0 rgba(255,255,255,0.95);" />`
      },
      {
        id: "slate_compact_input",
        name: "Slate Compact 输入框",
        category: "input",
        keywords: ["compact", "dashboard", "slate", "enterprise", "form"],
        html: `<input type="text" placeholder="{{content}}" style="width: 100%; max-width: 440px; border: 1px solid #94a3b8; border-radius: 10px; padding: 9px 11px; background: #f8fafc; color: #0f172a; box-shadow: inset 0 1px 0 rgba(255,255,255,0.95);" />`
      },
      {
        id: "rose_note_input",
        name: "Rose Note 输入框",
        category: "input",
        keywords: ["rose", "warm", "note", "editorial", "soft"],
        html: `<textarea placeholder="{{content}}" style="width: 100%; max-width: 460px; min-height: 96px; border: 1px solid #fbcfe8; border-radius: 14px; padding: 12px 14px; background: linear-gradient(180deg,#fff1f2 0%,#fff7fb 100%); color: #881337; box-shadow: 0 12px 28px rgba(190,24,93,0.1); resize: vertical;"></textarea>`
      },
      {
        id: "crystal_bento_card",
        name: "Crystal Bento 卡片",
        category: "card",
        keywords: ["bento", "crystal", "premium", "glass", "dashboard"],
        html: `<article style="border: 1px solid rgba(186,230,253,0.75); border-radius: 22px; background: linear-gradient(160deg,rgba(224,242,254,0.92) 0%,rgba(255,255,255,0.95) 60%); padding: 20px; box-shadow: 0 24px 54px rgba(14,116,144,0.16);"><p style="margin: 0 0 8px; color: #0e7490; font-size: 12px; letter-spacing: 0.08em; text-transform: uppercase; font-weight: 700;">Crystal</p><div style="margin: 0; color: #082f49; font-size: 15px; line-height: 1.7; font-weight: 600;">{{content}}</div></article>`
      },
      {
        id: "mono_frame_card",
        name: "Mono Frame 卡片",
        category: "card",
        keywords: ["minimal", "mono", "editorial", "grid", "clean"],
        html: `<article style="border: 1.5px solid #0f172a; border-radius: 14px; background: #ffffff; padding: 18px; box-shadow: 6px 6px 0 #0f172a;"><div style="margin: 0; color: #0f172a; font-size: 15px; line-height: 1.7; font-weight: 600;">{{content}}</div></article>`
      },
      {
        id: "amber_story_card",
        name: "Amber Story 卡片",
        category: "card",
        keywords: ["warm", "amber", "story", "magazine", "paper"],
        html: `<article style="border: 1px solid #fcd9a8; border-radius: 20px; background: linear-gradient(180deg,#fffbeb 0%,#fff7ed 100%); padding: 20px; box-shadow: 0 18px 42px rgba(217,119,6,0.14);"><p style="margin: 0 0 8px; color: #b45309; font-size: 12px; font-weight: 800; letter-spacing: 0.08em; text-transform: uppercase;">Story</p><div style="margin: 0; color: #78350f; font-size: 15px; line-height: 1.75; font-weight: 500;">{{content}}</div></article>`
      },
      {
        id: "neo_console_card",
        name: "Neo Console 卡片",
        category: "card",
        keywords: ["dark", "console", "neo", "terminal", "cyber"],
        html: `<article style="border: 1px solid #334155; border-radius: 16px; background: radial-gradient(circle at top left,#1e293b 0%,#0b1220 65%); padding: 18px; box-shadow: 0 20px 48px rgba(2,6,23,0.45), inset 0 0 0 1px rgba(56,189,248,0.12);"><div style="margin: 0; color: #cffafe; font-size: 15px; line-height: 1.7; font-weight: 600;">{{content}}</div></article>`
      },
      {
        id: "ruby_badge",
        name: "Ruby Spark 标签",
        category: "badge",
        keywords: ["ruby", "pink", "highlight", "tag", "vivid"],
        html: `<span style="display: inline-flex; align-items: center; padding: 5px 11px; border-radius: 999px; background: linear-gradient(135deg,#ffe4e6,#fbcfe8); color: #9f1239; border: 1px solid rgba(244,114,182,0.32); font-size: 12px; font-weight: 800;">{{content}}</span>`
      },
      {
        id: "cyan_badge",
        name: "Cyan Ring 标签",
        category: "badge",
        keywords: ["cyan", "tech", "ring", "status", "cool"],
        html: `<span style="display: inline-flex; align-items: center; gap: 7px; padding: 5px 11px; border-radius: 999px; background: #ecfeff; color: #155e75; border: 1px solid rgba(6,182,212,0.28); font-size: 12px; font-weight: 800;"><span style="width: 8px; height: 8px; border-radius: 999px; background: #06b6d4;"></span>{{content}}</span>`
      },
      {
        id: "charcoal_badge",
        name: "Charcoal 标签",
        category: "badge",
        keywords: ["dark", "charcoal", "minimal", "premium", "mono"],
        html: `<span style="display: inline-flex; align-items: center; padding: 5px 11px; border-radius: 999px; background: #111827; color: #e5e7eb; border: 1px solid #374151; font-size: 12px; font-weight: 700;">{{content}}</span>`
      },
      {
        id: "mint_badge",
        name: "Mint Halo 标签",
        category: "badge",
        keywords: ["mint", "halo", "soft", "fresh", "light"],
        html: `<span style="display: inline-flex; align-items: center; padding: 5px 11px; border-radius: 999px; background: linear-gradient(135deg,#dcfce7,#ccfbf1); color: #065f46; border: 1px solid rgba(34,197,94,0.25); box-shadow: 0 8px 18px rgba(16,185,129,0.14); font-size: 12px; font-weight: 800;">{{content}}</span>`
      },
      {
        id: "onyx_select",
        name: "Onyx Select 下拉",
        category: "select",
        keywords: ["dark", "onyx", "panel", "premium", "select"],
        html: `<select style="width: 100%; max-width: 320px; border: 1px solid #3b475a; border-radius: 14px; padding: 11px 12px; background: linear-gradient(180deg,#101826 0%,#0b1220 100%); color: #e2e8f0; box-shadow: 0 16px 36px rgba(2,6,23,0.36);"><option>{{content}}</option><option>主配置</option><option>实验组</option></select>`
      },
      {
        id: "mint_select",
        name: "Mint Select 下拉",
        category: "select",
        keywords: ["mint", "soft", "fresh", "form", "light"],
        html: `<select style="width: 100%; max-width: 320px; border: 1px solid #a7f3d0; border-radius: 14px; padding: 11px 12px; background: linear-gradient(180deg,#f0fdf4 0%,#dcfce7 100%); color: #065f46; box-shadow: 0 12px 30px rgba(16,185,129,0.14);"><option>{{content}}</option><option>标准</option><option>清新</option></select>`
      },
      {
        id: "sunrise_select",
        name: "Sunrise Select 下拉",
        category: "select",
        keywords: ["sunrise", "warm", "orange", "pink", "friendly"],
        html: `<select style="width: 100%; max-width: 320px; border: 1px solid #fdba74; border-radius: 14px; padding: 11px 12px; background: linear-gradient(135deg,#fff7ed 0%,#ffe4e6 100%); color: #9a3412; box-shadow: 0 12px 30px rgba(249,115,22,0.16);"><option>{{content}}</option><option>日出</option><option>晚霞</option></select>`
      },
      {
        id: "mono_select",
        name: "Mono Select 下拉",
        category: "select",
        keywords: ["minimal", "mono", "clean", "editorial", "shadcn"],
        html: `<select style="width: 100%; max-width: 320px; border: 1.5px solid #111827; border-radius: 10px; padding: 10px 12px; background: #ffffff; color: #111827; box-shadow: 4px 4px 0 #111827;"><option>{{content}}</option><option>A 方案</option><option>B 方案</option></select>`
      }
    ];

    const pinArtifactStyleState = new WeakMap();

    const state = {
      savedRuleSet: null,
      previewRuleSet: null,
      observer: null,
      applyQueued: false,
      isApplying: false,
      settings: { ...DEFAULT_CONTENT_SETTINGS },
      lastContextTarget: null,
      inline: {
        root: null,
        panel: null,
        prompt: null,
        title: null,
        meta: null,
        status: null,
        output: null,
        previewButton: null,
        saveButton: null,
        themeSearchInput: null,
        themeToneSelect: null,
        themeSelect: null,
        themePreviewButton: null,
        themeSaveButton: null,
        themePreviewTimer: null,
        lastThemePreviewId: "",
        themeSwitchGuardUntil: 0,
        componentSearchInput: null,
        componentCategorySelect: null,
        componentScopeSelect: null,
        componentMotionModeSelect: null,
        componentMotionSelect: null,
        componentSelect: null,
        componentPreviewButton: null,
        componentSaveButton: null,
        componentPreviewTimer: null,
        lastComponentPreviewId: "",
        pickButton: null,
        settingsButton: null,
        closeButton: null,
        clearButton: null,
        generatedRuleSet: null,
        busy: false
      },
      picker: {
        active: false,
        root: null,
        box: null,
        lassoSvg: null,
        lassoPath: null,
        badge: null,
        currentElement: null,
        pendingPrompt: "",
        reopenInlineAfterPick: false,
        reopenInlineOnCancel: false,
        previousCursor: "",
        isDrawing: false,
        hasDragged: false,
        pointerDownElement: null,
        points: [],
        bounds: null,
        lastPointer: null
      },
      drag: {
        active: false,
        dragging: false,
        target: null,
        pendingTarget: null,
        placeholder: null,
        placeholderWasExisting: false,
        originalStyles: null,
        currentDropContainer: null,
        startX: 0,
        startY: 0,
        offsetX: 0,
        offsetY: 0,
        sourceSelector: "",
        wasPinnedBeforeDrag: false,
        origLeft: 0,
        origTop: 0,
        mode: "relayout",
        parent: null,
        insertRef: null,
        insertBefore: true,
        startedInViewportHost: false,
        suppressClick: false,
        suppressClickTarget: null,
        suppressClickUntil: 0,
        pendingFollowDragRule: null,
        pendingFixedDragRule: null,
        liveLayerRoot: null,
        liveLayerValue: null,
        liveLayerHint: null,
        modeRoot: null,
        modePanel: null,
        modeStatus: null,
        modeLayerValue: null,
        modeLayerHint: null,
        modeFollowButton: null,
        modePinButton: null,
        modeBringFrontButton: null,
        modeLayerUpButton: null,
        modeLayerDownButton: null,
        modeSendBackButton: null,
        modeCancelButton: null
      }
    };

    void initialize();

    document.addEventListener("contextmenu", handleContextMenuEvent, true);
    document.addEventListener("mousemove", handlePointerMove, true);
    document.addEventListener("mousedown", handlePointerDown, true);
    document.addEventListener("mouseup", handlePointerUp, true);
    document.addEventListener("click", handleDragClick, true);
    document.addEventListener("keydown", handleKeydown, true);

    chrome.runtime.onMessage.addListener((request, _sender, sendResponse) => {
      handleMessage(request)
        .then((payload) => sendResponse({ ok: true, ...payload }))
        .catch((error) =>
          sendResponse({
            ok: false,
            error: error instanceof Error ? error.message : "Content script error."
          })
        );

      return true;
    });

    chrome.storage.onChanged.addListener((changes, areaName) => {
      if (areaName === "local" && changes.siteRuleSets) {
        void loadSavedRuleSet().then(() => scheduleApply());
        return;
      }

      if (areaName === "sync" && changes.enableMutationObserver) {
        state.settings.enableMutationObserver =
          typeof changes.enableMutationObserver.newValue === "boolean"
            ? changes.enableMutationObserver.newValue
            : DEFAULT_CONTENT_SETTINGS.enableMutationObserver;
        syncObserver();
      }
    });

    async function initialize() {
      await Promise.all([loadSavedRuleSet(), loadSettings()]);
      syncObserver();
      scheduleApply();
    }

    async function handleMessage(request) {
      switch (request?.type) {
        case "modifier:preview-rules":
          state.previewRuleSet = sanitizeRuleSet(request.ruleSet);
          scheduleApply();
          return {};
        case "modifier:clear-preview":
          state.previewRuleSet = null;
          scheduleApply();
          return {};
        case "modifier:refresh":
          await loadSavedRuleSet();
          scheduleApply();
          return {};
        case "modifier:open-inline-editor":
          openInlineEditor(request.menuContext);
          return {
            targetContext: serializeTargetContext()
          };
        default:
          return {};
      }
    }

    async function loadSavedRuleSet() {
      const stored = await chrome.storage.local.get({ siteRuleSets: {} });
      state.savedRuleSet = sanitizeRuleSet(stored.siteRuleSets?.[getSiteKey()]);
    }

    async function loadSettings() {
      const storedSettings = await chrome.storage.sync.get(DEFAULT_CONTENT_SETTINGS);
      state.settings.enableMutationObserver =
        typeof storedSettings.enableMutationObserver === "boolean"
          ? storedSettings.enableMutationObserver
          : DEFAULT_CONTENT_SETTINGS.enableMutationObserver;
    }

    function syncObserver() {
      if (state.settings.enableMutationObserver) {
        ensureObserver();
        return;
      }

      state.observer?.disconnect();
      state.observer = null;
    }

    function ensureObserver() {
      if (state.observer) {
        return;
      }

      state.observer = new MutationObserver((mutations) => {
        if (
          !state.isApplying &&
          !state.drag.dragging && !state.drag.pendingTarget &&
          hasRelevantMutations(mutations)
        ) {
          scheduleApply();
        }
      });

      state.observer.observe(document.documentElement || document.body, {
        childList: true,
        subtree: true,
        characterData: true
      });
    }

    function scheduleApply() {
      if (state.drag.dragging || state.drag.pendingTarget) {
        return;
      }

      if (state.applyQueued) {
        return;
      }

      state.applyQueued = true;
      window.setTimeout(() => {
        state.applyQueued = false;
        applyRules();
      }, 60);
    }

    function applyRules() {
      state.isApplying = true;

      try {
        const savedRules = Array.isArray(state.savedRuleSet?.rules) ? state.savedRuleSet.rules : [];
        const previewRules = Array.isArray(state.previewRuleSet?.rules)
          ? state.previewRuleSet.rules
          : [];
        const isThemeTemplatePreview = containsThemeTemplateRule(previewRules);
        const effectiveSavedCustomCssRules = isThemeTemplatePreview
          ? []
          : (state.savedRuleSet?.rules ?? []).filter((rule) => rule.type === "customCss");
        const activeRules = [...savedRules, ...previewRules];
        const moveRules = activeRules.filter((rule) => rule.type === "moveNode");
        const pinRules = activeRules.filter((rule) => rule.type === "pinNode");
        const pagePinRules = activeRules.filter((rule) => rule.type === "pagePinNode");
        const activePinSelectors = new Set(
          [...pinRules, ...pagePinRules]
            .map((rule) => String(rule?.selector ?? "").trim())
            .filter(Boolean)
        );

        cleanupInactivePinArtifacts(activePinSelectors);

        renderStyleTag(
          SAVED_STYLE_ID,
          buildCssText(savedRules.filter((rule) => rule.type !== "customCss" && rule.type !== "moveNode" && rule.type !== "pinNode")),
          effectiveSavedCustomCssRules
        );
        renderStyleTag(
          PREVIEW_STYLE_ID,
          buildCssText(previewRules.filter((rule) => rule.type !== "customCss" && rule.type !== "moveNode" && rule.type !== "pinNode")),
          (state.previewRuleSet?.rules ?? []).filter((rule) => rule.type === "customCss")
        );

        for (const rule of moveRules) {
          applyMoveNodeRule(rule);
        }

        for (const rule of pinRules) {
          applyPinNodeRule(rule);
        }

        for (const rule of pagePinRules) {
          applyPagePinNodeRule(rule);
        }

        for (const rule of activeRules) {
          applyDomRule(rule);
        }
      } finally {
        state.isApplying = false;
      }
    }

    function renderStyleTag(styleId, generatedCss, customCssRules) {
      let styleTag = document.getElementById(styleId);

      if (!generatedCss && (!customCssRules || customCssRules.length === 0)) {
        styleTag?.remove();
        return;
      }

      if (!styleTag) {
        styleTag = document.createElement("style");
        styleTag.id = styleId;
        styleTag.setAttribute(OWNED_ATTRIBUTE, "true");
        (document.head || document.documentElement).appendChild(styleTag);
      }

      const customCss = (customCssRules ?? [])
        .map((rule) => {
          const css = String(rule.css ?? "").trim();
          if (!css) return "";
          if (css.includes("/* cwm-theme-template */")) {
            return css;
          }
          // 确保 customCss 规则里的声明都带 !important（兜底处理）
          return css.replace(
            /:\s*([^;}{!]+?)\s*(?:!important)?\s*;/g,
            (_, val) => `: ${val.trim()} !important;`
          );
        })
        .filter(Boolean)
        .join("\n\n");

      const nextStyleText = [generatedCss, customCss].filter(Boolean).join("\n\n");
      if (styleTag.textContent === nextStyleText) {
        return;
      }

      styleTag.textContent = nextStyleText;
    }

    function buildCssText(rules) {
      return rules
        .map((rule) => {
          if (rule.type === "hide") {
            return `${rule.selector} { display: none !important; }`;
          }

          if (rule.type === "style") {
            const declarations = Object.entries(rule.declarations ?? {})
              .map(([property, value]) => `${toKebabCase(property)}: ${value} !important;`)
              .join(" ");

            return declarations ? `${rule.selector} { ${declarations} }` : "";
          }

          return "";
        })
        .filter(Boolean)
        .join("\n");
    }

    function applyDomRule(rule) {
      if (!rule || typeof rule !== "object") {
        return;
      }

      if (rule.type === "moveNode" || rule.type === "pinNode" || rule.type === "pagePinNode") {
        return;
      }

      if (rule.type === "setText") {
        queryAll(rule.selector).forEach((element) => {
          element.textContent = String(rule.text ?? "");
        });
        return;
      }

      if (rule.type === "textReplace") {
        queryAll(rule.selector).forEach((element) => {
          const sourceText = String(element.textContent ?? "");
          const find = String(rule.find ?? "");
          const replace = String(rule.replace ?? "");
          const replaceOnce = Boolean(rule.replaceOnce);

          if (!sourceText || !find) {
            return;
          }

          if (rule.matchCase) {
            if (replaceOnce) {
              const index = sourceText.indexOf(find);
              if (index < 0) {
                return;
              }
              element.textContent =
                sourceText.slice(0, index) + replace + sourceText.slice(index + find.length);
              return;
            }
            element.textContent = sourceText.split(find).join(replace);
            return;
          }

          const matcher = new RegExp(escapeForRegExp(find), replaceOnce ? "i" : "gi");
          element.textContent = sourceText.replace(matcher, replace);
        });
        return;
      }

      if (rule.type === "attribute") {
        queryAll(rule.selector).forEach((element) => {
          element.setAttribute(String(rule.attribute ?? ""), String(rule.value ?? ""));
        });
        return;
      }

      if (rule.type === "replaceNode") {
        const html = String(rule.html ?? "").trim();
        if (!html) {
          return;
        }

        const replaceOnce = rule.replaceOnce !== false;
        let replaced = false;
        queryAll(rule.selector).forEach((element) => {
          if (replaceOnce && replaced) {
            return;
          }
          if (isExtensionOwnedElement(element) || !(element instanceof Element)) {
            return;
          }

          const replacement = buildReplacementElement(element, rule);
          if (!replacement) {
            return;
          }

          element.replaceWith(replacement);
          replaced = true;
        });
      }
    }

    function buildReplacementElement(sourceElement, rule) {
      const html = String(rule.html ?? "").trim();
      if (!html) {
        return null;
      }

      const template = document.createElement("template");
      const sourceHtml = Boolean(rule.preserveHtml)
        ? sanitizeSourceInnerHtml(sourceElement.innerHTML)
        : "";
      template.innerHTML = sanitizeReplacementHtml(
        sourceHtml ? html.replace(/\{\{content\}\}/g, sourceHtml) : html
      );
      const replacement = template.content.firstElementChild;
      if (!(replacement instanceof Element)) {
        return null;
      }

      if (Boolean(rule.preserveText)) {
        const sourceText = String(sourceElement.textContent ?? "").trim();
        if (sourceText) {
          if (replacement instanceof HTMLInputElement || replacement instanceof HTMLTextAreaElement) {
            replacement.value = sourceText;
            if (!replacement.getAttribute("placeholder")) {
              replacement.setAttribute("placeholder", sourceText);
            }
          } else if (replacement instanceof HTMLOptionElement) {
            replacement.textContent = sourceText;
          } else if (replacement instanceof HTMLSelectElement) {
            const firstOption = replacement.querySelector("option");
            if (firstOption) {
              firstOption.textContent = sourceText;
            }
          } else if (!(replacement instanceof HTMLSelectElement)) {
            const hasContentPlaceholder = html.includes("{{content}}");
            if (!Boolean(rule.preserveHtml) || !hasContentPlaceholder) {
              replacement.textContent = sourceText;
            }
          }
        }
      }

      if (Boolean(rule.preserveHref)) {
        const sourceHref = String(sourceElement.getAttribute?.("href") ?? "").trim();
        if (sourceHref && replacement instanceof HTMLAnchorElement) {
          replacement.setAttribute("href", sourceHref);
        }
      }

      return replacement;
    }

    function sanitizeReplacementHtml(html) {
      return String(html ?? "")
        .replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, "")
        .replace(/\son[a-z]+\s*=\s*(['"]).*?\1/gi, "")
        .replace(/\sjavascript:/gi, "");
    }

    function sanitizeSourceInnerHtml(html) {
      return sanitizeReplacementHtml(html)
        .replace(/\bcontenteditable\s*=\s*(['"]).*?\1/gi, "")
        .trim();
    }

    function applyMoveNodeRule(rule) {
      if (!rule || rule.type !== "moveNode") {
        return;
      }

      const selector = String(rule.selector ?? "").trim();
      const directMatch = findDirectMatchesBySelector(selector)[0] || null;
      const pinnedMatch = findPinnedElementsBySourceSelector(selector)[0] || null;
      const element = directMatch || pinnedMatch;
      const targetParent = queryAll(rule.targetParentSelector)[0];
      if (!element || !targetParent || element === targetParent || element.contains(targetParent)) {
        return;
      }

      const beforeCandidate = rule.beforeSelector ? queryAll(rule.beforeSelector)[0] : null;
      const beforeNode = beforeCandidate?.parentElement === targetParent ? beforeCandidate : null;

      if (element.parentElement === targetParent) {
        const nextEligibleSibling = getNextDroppableSibling(element, element, null);
        if (nextEligibleSibling === beforeNode) {
          return;
        }
      }

      normalizeElementForDocumentFlow(element, selector);
      targetParent.insertBefore(element, beforeNode);
      element.setAttribute("data-cwm-move-source-selector", String(rule.selector ?? ""));
    }

    function normalizeElementForDocumentFlow(element, selector = "") {
      if (!(element instanceof HTMLElement)) {
        return;
      }

      element.removeAttribute(PIN_SOURCE_ATTRIBUTE);
      if (selector) {
        const placeholder = findPinnedPlaceholder(selector);
        if (placeholder instanceof HTMLElement && placeholder.parentElement) {
          placeholder.removeAttribute(PIN_ADOPTED_PLACEHOLDER_ATTRIBUTE);
          placeholder.removeAttribute(PIN_PLACEHOLDER_ATTRIBUTE);
          if (placeholder.getAttribute(OWNED_ATTRIBUTE) === "true") {
            placeholder.remove();
          }
        }
      }

      element.style.position = "";
      element.style.left = "";
      element.style.top = "";
      element.style.width = "";
      element.style.height = "";
      element.style.margin = "";
      element.style.zIndex = "";
      element.style.boxSizing = "";
      element.style.pointerEvents = "";
      element.style.outline = "";
      element.style.opacity = "";
      element.style.boxShadow = "";
      element.style.maxWidth = "";
    }

    function applyPinNodeRule(rule) {
      if (!rule || rule.type !== "pinNode") {
        return;
      }

      const selector = String(rule.selector ?? "").trim();
      if (!selector) {
        return;
      }

      const directMatch = findDirectMatchesBySelector(selector)[0] || null;
      const pinnedMatch = findPinnedElementsBySourceSelector(selector)[0] || null;
      const element = shouldPreferExistingPinnedMenuTarget(directMatch, pinnedMatch)
        ? pinnedMatch || directMatch
        : directMatch || pinnedMatch;
      if (!element) {
        return;
      }

      element.setAttribute(PIN_SOURCE_ATTRIBUTE, selector);
      const placeholder = hydratePinnedPlaceholder(element, rule, selector);
      suppressExtraPinDuplicates(selector, element, placeholder);
      promotePinnedElementToViewportHost(element);
      applyPinnedElementStyles(element, rule);
    }

    function applyPagePinNodeRule(rule) {
      if (!rule || rule.type !== "pagePinNode") {
        return;
      }

      const selector = String(rule.selector ?? "").trim();
      if (!selector) {
        return;
      }

      const directMatch = findDirectMatchesBySelector(selector)[0] || null;
      const pinnedMatch = findPinnedElementsBySourceSelector(selector)[0] || null;
      const element = directMatch || pinnedMatch;
      if (!element) {
        return;
      }

      normalizeElementForDocumentFlow(element, selector);
      element.setAttribute(PIN_SOURCE_ATTRIBUTE, selector);
      promotePinnedElementToViewportHost(element);
      applyPagePinnedElementStyles(element, rule);
    }

    function promotePinnedElementToViewportHost(element) {
      if (!(element instanceof HTMLElement)) {
        return;
      }

      const host = document.body || document.documentElement;
      if (!host || element.parentElement === host) {
        return;
      }

      host.appendChild(element);
    }

    function shouldPreferExistingPinnedMenuTarget(directMatch, pinnedMatch) {
      if (!(directMatch instanceof HTMLElement) || !(pinnedMatch instanceof HTMLElement)) {
        return false;
      }

      return isDropdownLikePinnedTarget(directMatch) || isDropdownLikePinnedTarget(pinnedMatch);
    }

    function isDropdownLikePinnedTarget(element) {
      if (!(element instanceof Element)) {
        return false;
      }

      const role = String(element.getAttribute("role") ?? "").trim().toLowerCase();
      if (["menuitem", "option"].includes(role)) {
        return true;
      }

      const tag = element.tagName.toLowerCase();
      if (tag === "option") {
        return true;
      }

      return Boolean(
        element.closest(
          "[role='menu'], [role='menubar'], [role='listbox'], menu, select, [class*='dropdown'], [class*='submenu']"
        )
      );
    }

    function resolveDragPointerOffset(element, rect, clientX, clientY) {
      if (isDropdownLikePinnedTarget(element)) {
        return {
          offsetX: rect.width * 0.5,
          offsetY: rect.height * 0.5
        };
      }

      return {
        offsetX: clientX - rect.left,
        offsetY: clientY - rect.top
      };
    }

    function hydratePinnedPlaceholder(element, rule, selector) {
      const existing = findPinnedPlaceholder(selector);
      const directAnchor = findDirectMatchesBySelector(selector, { exclude: element })[0] || null;
      if (existing && isMisplacedViewportPlaceholder(existing, directAnchor)) {
        existing.remove();
      } else if (existing) {
        finalizePlaceholderAppearance(existing);
        return existing;
      }

      if (directAnchor) {
        adoptDirectMatchAsPinnedPlaceholder(directAnchor, selector);
        return directAnchor;
      }

      const viewportHost = document.body || document.documentElement;
      if (element.parentElement === viewportHost) {
        return null;
      }

      const placeholder = createPlaceholderForPinnedElement(element, {
        preview: false,
        sourceSelector: selector,
        width: Number.isFinite(rule.width) && rule.width > 0 ? rule.width : null,
        height: Number.isFinite(rule.height) && rule.height > 0 ? rule.height : null
      });
      element.parentElement?.insertBefore(placeholder, element);
      finalizePlaceholderAppearance(placeholder);
      return placeholder;
    }

    function isMisplacedViewportPlaceholder(placeholder, directAnchor) {
      const viewportHost = document.body || document.documentElement;
      return Boolean(
        directAnchor &&
        placeholder instanceof HTMLElement &&
        placeholder.getAttribute(OWNED_ATTRIBUTE) === "true" &&
        placeholder.parentElement === viewportHost
      );
    }

    function findPinnedPlaceholder(selector) {
      return Array.from(document.querySelectorAll(`[${PIN_PLACEHOLDER_ATTRIBUTE}]`)).find(
        (element) => element.getAttribute(PIN_PLACEHOLDER_ATTRIBUTE) === String(selector ?? "")
      ) || null;
    }

    function adoptDirectMatchAsPinnedPlaceholder(element, selector) {
      if (!(element instanceof HTMLElement)) {
        return;
      }

      restoreSuppressedPinnedDuplicate(element);
      rememberPinArtifactStyles(element);
      element.setAttribute(PIN_PLACEHOLDER_ATTRIBUTE, selector);
      element.setAttribute(PIN_ADOPTED_PLACEHOLDER_ATTRIBUTE, selector);
      element.setAttribute("aria-hidden", "true");
      finalizePlaceholderAppearance(element);
    }

    function suppressExtraPinDuplicates(selector, pinnedElement, placeholder) {
      const extraDirectMatches = findDirectMatchesBySelector(selector, { exclude: pinnedElement });
      const extraPinnedMatches = findPinnedElementsBySourceSelector(selector)
        .filter((element) => element !== pinnedElement);

      Array.from(new Set([...extraDirectMatches, ...extraPinnedMatches])).forEach((element) => {
        if (element === placeholder) {
          finalizePlaceholderAppearance(element);
          return;
        }

        suppressPinnedDuplicate(element, selector);
      });
    }

    function suppressPinnedDuplicate(element, selector) {
      if (!(element instanceof HTMLElement)) {
        return;
      }

      if (element.getAttribute(PIN_PLACEHOLDER_ATTRIBUTE) === selector) {
        finalizePlaceholderAppearance(element);
        return;
      }

      rememberPinArtifactStyles(element);
      element.setAttribute(PIN_SUPPRESSED_DUPLICATE_ATTRIBUTE, selector);
      element.setAttribute("aria-hidden", "true");
      element.style.display = "none";
      element.style.pointerEvents = "none";
    }

    function cleanupInactivePinArtifacts(activePinSelectors) {
      Array.from(document.querySelectorAll(`[${PIN_ADOPTED_PLACEHOLDER_ATTRIBUTE}]`)).forEach((element) => {
        const selector = String(element.getAttribute(PIN_ADOPTED_PLACEHOLDER_ATTRIBUTE) ?? "").trim();
        if (selector && activePinSelectors.has(selector)) {
          finalizePlaceholderAppearance(element);
          return;
        }

        restoreAdoptedPinnedPlaceholder(element);
      });

      Array.from(document.querySelectorAll(`[${PIN_SUPPRESSED_DUPLICATE_ATTRIBUTE}]`)).forEach((element) => {
        const selector = String(element.getAttribute(PIN_SUPPRESSED_DUPLICATE_ATTRIBUTE) ?? "").trim();
        if (selector && activePinSelectors.has(selector)) {
          element.style.display = "none";
          element.style.pointerEvents = "none";
          element.setAttribute("aria-hidden", "true");
          return;
        }

        restoreSuppressedPinnedDuplicate(element);
      });

      Array.from(document.querySelectorAll(`[${PIN_PLACEHOLDER_ATTRIBUTE}]`)).forEach((element) => {
        const selector = String(element.getAttribute(PIN_PLACEHOLDER_ATTRIBUTE) ?? "").trim();
        if (!selector || activePinSelectors.has(selector)) {
          return;
        }

        if (element.getAttribute(PIN_ADOPTED_PLACEHOLDER_ATTRIBUTE) === selector) {
          restoreAdoptedPinnedPlaceholder(element);
          return;
        }

        if (element.getAttribute(OWNED_ATTRIBUTE) === "true") {
          element.remove();
          return;
        }

        element.removeAttribute(PIN_PLACEHOLDER_ATTRIBUTE);
      });
    }

    function rememberPinArtifactStyles(element) {
      if (!(element instanceof HTMLElement) || pinArtifactStyleState.has(element)) {
        return;
      }

      pinArtifactStyleState.set(element, {
        display: element.style.display,
        visibility: element.style.visibility,
        pointerEvents: element.style.pointerEvents,
        border: element.style.border,
        background: element.style.background,
        boxShadow: element.style.boxShadow,
        ariaHidden: element.getAttribute("aria-hidden")
      });
    }

    function restorePinArtifactStyles(element) {
      if (!(element instanceof HTMLElement)) {
        return;
      }

      const snapshot = pinArtifactStyleState.get(element);
      if (!snapshot) {
        return;
      }

      element.style.display = snapshot.display;
      element.style.visibility = snapshot.visibility;
      element.style.pointerEvents = snapshot.pointerEvents;
      element.style.border = snapshot.border;
      element.style.background = snapshot.background;
      element.style.boxShadow = snapshot.boxShadow;
      if (snapshot.ariaHidden == null) {
        element.removeAttribute("aria-hidden");
      } else {
        element.setAttribute("aria-hidden", snapshot.ariaHidden);
      }
      pinArtifactStyleState.delete(element);
    }

    function restoreAdoptedPinnedPlaceholder(element) {
      if (!(element instanceof HTMLElement)) {
        return;
      }

      restorePinArtifactStyles(element);
      element.removeAttribute(PIN_ADOPTED_PLACEHOLDER_ATTRIBUTE);
      element.removeAttribute(PIN_PLACEHOLDER_ATTRIBUTE);
    }

    function restoreSuppressedPinnedDuplicate(element) {
      if (!(element instanceof HTMLElement) || !element.hasAttribute(PIN_SUPPRESSED_DUPLICATE_ATTRIBUTE)) {
        return;
      }

      restorePinArtifactStyles(element);
      element.removeAttribute(PIN_SUPPRESSED_DUPLICATE_ATTRIBUTE);
    }

    function restoreDraggedElementDomPosition(target) {
      const placeholder = state.drag.placeholder;
      if (
        state.drag.startedInViewportHost ||
        !(target instanceof HTMLElement) ||
        !(placeholder instanceof HTMLElement) ||
        !placeholder.parentElement
      ) {
        return;
      }

      if (target.parentElement === placeholder.parentElement && target.previousElementSibling === placeholder) {
        return;
      }

      placeholder.parentElement.insertBefore(target, placeholder.nextSibling ?? null);
    }

    function applyPinnedElementStyles(element, rule) {
      element.style.position = "fixed";
      element.style.left = `${Number(rule.left) || 0}px`;
      element.style.top = `${Number(rule.top) || 0}px`;
      if (Number(rule.width) > 0) {
        element.style.width = `${Number(rule.width)}px`;
      }
      if (Number(rule.height) > 0) {
        element.style.height = `${Number(rule.height)}px`;
      }
      element.style.margin = "0";
      element.style.zIndex = `${Number(rule.zIndex) || 2147483644}`;
      element.style.boxSizing = "border-box";
      element.style.pointerEvents = "auto";
    }

    function applyPagePinnedElementStyles(element, rule) {
      element.style.position = "absolute";
      element.style.left = `${Number(rule.documentLeft) || 0}px`;
      element.style.top = `${Number(rule.documentTop) || 0}px`;
      if (Number(rule.width) > 0) {
        element.style.width = `${Number(rule.width)}px`;
      }
      if (Number(rule.height) > 0) {
        element.style.height = `${Number(rule.height)}px`;
      }
      element.style.margin = "0";
      element.style.zIndex = `${Number(rule.zIndex) || 2147483644}`;
      element.style.boxSizing = "border-box";
      element.style.pointerEvents = "auto";
    }

    function handleContextMenuEvent(event) {
      if (state.picker.active) {
        event.preventDefault();
        event.stopPropagation();
        return;
      }

      if (event.shiftKey) {
        return;
      }

      const targetElement = resolveContextElement(event.target);
      if (!targetElement) {
        return;
      }

      state.lastContextTarget = captureTargetContext(targetElement, {
        x: event.clientX,
        y: event.clientY
      });

      event.preventDefault();
      event.stopPropagation();

      openInlineEditor({
        selectionText: String(window.getSelection?.()?.toString?.() ?? "").trim()
      });
    }

    function handlePointerMove(event) {
      if (!state.picker.active) {
        return;
      }

      if (state.picker.isDrawing) {
        updatePickerDrawing(event);
        return;
      }

      const targetElement = resolveContextElement(event.target);
      if (!targetElement) {
        return;
      }

      updatePickerTarget(targetElement, event.clientX, event.clientY);
    }

    function handlePointerDown(event) {
      if (state.picker.active) {
        handlePickerPointerDown(event);
        return;
      }

      // 拖拽模式下不关闭 inline editor
      if (state.drag.active) {
        return;
      }

      if (!state.inline.root || state.inline.root.hidden) {
        return;
      }

      if (event.target instanceof Element && event.target.closest(`#${INLINE_ROOT_ID}`)) {
        return;
      }

      closeInlineEditor();
    }

    function handlePointerUp(event) {
      if (!state.picker.active) {
        return;
      }

      handlePickerPointerUp(event);
    }

    function handleKeydown(event) {
      if (event.ctrlKey && event.shiftKey && event.key.toLowerCase() === "x") {
        event.preventDefault();
        startPickerMode({
          preservePrompt: !state.inline.root?.hidden,
          reopenInlineAfterPick: true,
          reopenInlineOnCancel: false
        });
        return;
      }

      if (state.drag.dragging) {
        if (event.key === "]") {
          event.preventDefault();
          setDragLayer(getCurrentDragLayer() + 1);
          return;
        }

        if (event.key === "[") {
          event.preventDefault();
          setDragLayer(getCurrentDragLayer() - 1);
          return;
        }

        if (event.key === "PageUp") {
          event.preventDefault();
          setDragLayer(DRAG_LAYER_MAX);
          return;
        }

        if (event.key === "PageDown") {
          event.preventDefault();
          setDragLayer(DRAG_LAYER_MIN);
          return;
        }
      }

      if (event.key !== "Escape") {
        return;
      }

      if (state.drag.modeRoot && !state.drag.modeRoot.hidden) {
        event.preventDefault();
        cancelDragSaveMode();
        return;
      }

      if (state.picker.active) {
        event.preventDefault();
        stopPickerMode({ reopenInline: state.picker.reopenInlineOnCancel });
        return;
      }

      if (!state.inline.root || state.inline.root.hidden) {
        return;
      }

      closeInlineEditor();
    }

    function openInlineEditor(menuContext = {}, options = {}) {
      ensureInlineEditor();

      const baseTarget =
        state.lastContextTarget ||
        captureTargetContext(resolveContextElement(document.activeElement) || document.body, {
          x: Math.round(window.innerWidth * 0.5),
          y: 96
        });

      state.lastContextTarget = {
        ...baseTarget,
        selectedText: String(menuContext.selectionText ?? baseTarget.selectedText ?? "").trim(),
        href: String(menuContext.linkUrl ?? baseTarget.href ?? "").trim(),
        src: String(menuContext.srcUrl ?? baseTarget.src ?? "").trim(),
        mediaType: String(menuContext.mediaType ?? "").trim()
      };

      state.inline.generatedRuleSet = null;
      state.inline.output.textContent = "AI 会先理解你的话，再直接修改当前目标，不会给你看 JSON。";
      state.inline.prompt.value = options.preservePrompt
        ? String(options.promptValue ?? state.inline.prompt.value ?? "").trim()
        : "";
      setInlineStatus("");
      syncInlineButtons();
      updateInlineTargetSummary();
      state.inline.root.hidden = false;
      state.inline.root.style.visibility = "hidden";
      positionInlineEditor(state.lastContextTarget.x, state.lastContextTarget.y);
      state.inline.root.style.visibility = "visible";
      state.inline.prompt.focus();
    }

    function closeInlineEditor() {
      if (!state.inline.root) {
        return;
      }

      state.inline.root.hidden = true;
    }

    function ensureInlineEditor() {
      if (state.inline.root) {
        return;
      }

      ensureInlineStyle();

      const root = document.createElement("div");
      root.id = INLINE_ROOT_ID;
      root.setAttribute(OWNED_ATTRIBUTE, "true");
      root.hidden = true;
      root.innerHTML = `
        <section class="cwm-inline-panel" role="dialog" aria-label="AI modify target">
          <header class="cwm-inline-header">
            <div>
              <p class="cwm-inline-eyebrow">右键 AI 修改</p>
              <h2 class="cwm-inline-title">定向修改当前内容</h2>
            </div>
            <div class="cwm-inline-header-actions">
              <button type="button" class="cwm-inline-pick">圈选目标 / 画圈</button>
              <button type="button" class="cwm-inline-settings" aria-label="Open settings">⚙</button>
              <button type="button" class="cwm-inline-close" aria-label="Close">×</button>
            </div>
          </header>
          <section class="cwm-inline-target">
            <p class="cwm-inline-target-label">当前目标</p>
            <p class="cwm-inline-target-title"></p>
            <p class="cwm-inline-target-meta"></p>
          </section>
          <label class="cwm-inline-field">
            <span>你的需求</span>
            <textarea class="cwm-inline-prompt" rows="4" placeholder="例如：把这段标题改成『立即下载』，颜色换成红色"></textarea>
          </label>
          <section class="cwm-inline-theme">
            <p class="cwm-inline-target-label">主题模板</p>
            <input class="cwm-inline-theme-search" type="search" placeholder="搜索模板（名称 / ID）" />
            <select class="cwm-inline-theme-tone">
              <option value="all">全部模板</option>
              <option value="light">仅浅色</option>
              <option value="dark">仅深色</option>
            </select>
            <select class="cwm-inline-theme-select"></select>
            <div class="cwm-inline-theme-actions">
              <button type="button" class="cwm-inline-secondary cwm-inline-theme-preview">预览主题</button>
              <button type="button" class="cwm-inline-secondary cwm-inline-theme-save">保存主题</button>
            </div>
          </section>
          <section class="cwm-inline-component">
            <p class="cwm-inline-target-label">组件模板（内置）</p>
            <input class="cwm-inline-component-search" type="search" placeholder="搜索组件（名称 / ID）" />
            <select class="cwm-inline-component-category">
              <option value="all">全部组件</option>
              <option value="button">按钮</option>
              <option value="input">输入框</option>
              <option value="card">卡片</option>
              <option value="badge">标签</option>
              <option value="select">下拉框</option>
            </select>
            <select class="cwm-inline-component-scope">
              <option value="target">仅当前选中目标</option>
              <option value="page">网页同类全部</option>
            </select>
            <select class="cwm-inline-component-motion-mode">
              <option value="static" selected>静止组件</option>
            </select>
            <select class="cwm-inline-component-motion">
              <option value="very-soft" selected>非常柔和动效</option>
              <option value="soft">柔和动效</option>
              <option value="off">关闭动效</option>
            </select>
            <select class="cwm-inline-component-select"></select>
            <div class="cwm-inline-component-actions">
              <button type="button" class="cwm-inline-secondary cwm-inline-component-preview">预览组件</button>
              <button type="button" class="cwm-inline-secondary cwm-inline-component-save">保存组件</button>
            </div>
          </section>
          <div class="cwm-inline-actions">
            <button type="button" class="cwm-inline-primary">直接修改</button>
            <button type="button" class="cwm-inline-secondary cwm-inline-save" disabled>永久保存</button>
            <button type="button" class="cwm-inline-secondary cwm-inline-clear">恢复预览</button>
            <button type="button" class="cwm-inline-secondary cwm-inline-page-theme">改整页风格</button>
            <button type="button" class="cwm-inline-secondary cwm-inline-drag-toggle">开启拖拽</button>
          </div>
          <p class="cwm-inline-status" aria-live="polite"></p>
          <section class="cwm-inline-details">
            <p class="cwm-inline-target-label">AI 会这样改</p>
            <p class="cwm-inline-output">AI 会先理解你的话，再直接修改当前目标，不会给你看 JSON。</p>
          </section>
        </section>
      `;

      (document.body || document.documentElement).appendChild(root);

      state.inline.root = root;
      state.inline.panel = root.querySelector(".cwm-inline-panel");
      state.inline.prompt = root.querySelector(".cwm-inline-prompt");
      state.inline.title = root.querySelector(".cwm-inline-target-title");
      state.inline.meta = root.querySelector(".cwm-inline-target-meta");
      state.inline.status = root.querySelector(".cwm-inline-status");
      state.inline.output = root.querySelector(".cwm-inline-output");
      state.inline.previewButton = root.querySelector(".cwm-inline-primary");
      state.inline.saveButton = root.querySelector(".cwm-inline-save");
      state.inline.themeSearchInput = root.querySelector(".cwm-inline-theme-search");
      state.inline.themeToneSelect = root.querySelector(".cwm-inline-theme-tone");
      state.inline.themeSelect = root.querySelector(".cwm-inline-theme-select");
      state.inline.themePreviewButton = root.querySelector(".cwm-inline-theme-preview");
      state.inline.themeSaveButton = root.querySelector(".cwm-inline-theme-save");
      state.inline.componentSearchInput = root.querySelector(".cwm-inline-component-search");
      state.inline.componentCategorySelect = root.querySelector(".cwm-inline-component-category");
      state.inline.componentScopeSelect = root.querySelector(".cwm-inline-component-scope");
      state.inline.componentMotionModeSelect = root.querySelector(".cwm-inline-component-motion-mode");
      state.inline.componentMotionSelect = root.querySelector(".cwm-inline-component-motion");
      state.inline.componentSelect = root.querySelector(".cwm-inline-component-select");
      state.inline.componentPreviewButton = root.querySelector(".cwm-inline-component-preview");
      state.inline.componentSaveButton = root.querySelector(".cwm-inline-component-save");
      state.inline.pickButton = root.querySelector(".cwm-inline-pick");
      state.inline.settingsButton = root.querySelector(".cwm-inline-settings");
      state.inline.clearButton = root.querySelector(".cwm-inline-clear");
      state.inline.closeButton = root.querySelector(".cwm-inline-close");
      state.inline.pageThemeButton = root.querySelector(".cwm-inline-page-theme");
      state.inline.dragToggleButton = root.querySelector(".cwm-inline-drag-toggle");
      renderInlineThemeTemplateOptions();
      renderInlineComponentTemplateOptions();

      state.inline.pickButton.addEventListener("click", () => {
        startPickerMode({
          preservePrompt: true,
          reopenInlineAfterPick: true,
          reopenInlineOnCancel: true
        });
      });
      state.inline.settingsButton?.addEventListener("click", () => {
        void openInlineSettingsPage();
      });
      state.inline.previewButton.addEventListener("click", () => {
        void generateInlinePreview();
      });
      state.inline.saveButton.addEventListener("click", () => {
        void saveInlineRuleSet();
      });
      state.inline.themePreviewButton.addEventListener("click", () => {
        void previewInlineThemeTemplate();
      });
      state.inline.themeSaveButton.addEventListener("click", () => {
        void saveInlineThemeTemplate();
      });
      state.inline.componentPreviewButton?.addEventListener("click", () => {
        void previewInlineComponentTemplate();
      });
      state.inline.componentSaveButton?.addEventListener("click", () => {
        void saveInlineComponentTemplate();
      });
      state.inline.themeSelect.addEventListener("change", () => {
        queueInlineThemePreview();
      });
      state.inline.themeSearchInput?.addEventListener("input", () => {
        renderInlineThemeTemplateOptions();
      });
      state.inline.themeToneSelect?.addEventListener("change", () => {
        renderInlineThemeTemplateOptions();
      });
      state.inline.componentSelect?.addEventListener("change", () => {
        queueInlineComponentPreview();
      });
      state.inline.componentSearchInput?.addEventListener("input", () => {
        renderInlineComponentTemplateOptions();
      });
      state.inline.componentCategorySelect?.addEventListener("change", () => {
        renderInlineComponentTemplateOptions();
      });
      state.inline.componentScopeSelect?.addEventListener("change", () => {
        queueInlineComponentPreview();
      });
      state.inline.componentMotionModeSelect?.addEventListener("change", () => {
        applyInlineComponentMotionModeUi();
        queueInlineComponentPreview();
      });
      state.inline.componentMotionSelect?.addEventListener("change", () => {
        queueInlineComponentPreview();
      });
      state.inline.clearButton.addEventListener("click", () => {
        void clearInlinePreview();
      });
      state.inline.closeButton.addEventListener("click", () => {
        closeInlineEditor();
      });
      state.inline.pageThemeButton.addEventListener("click", () => {
        activatePageThemeMode();
      });
      state.inline.dragToggleButton.addEventListener("click", () => {
        toggleDragMode();
      });
      applyInlineComponentMotionModeUi();

      root.addEventListener("contextmenu", (event) => {
        event.stopPropagation();
      });
    }

    function ensurePickerUi() {
      if (state.picker.root) {
        return;
      }

      ensureInlineStyle();

      const root = document.createElement("div");
      root.id = PICKER_ROOT_ID;
      root.setAttribute(OWNED_ATTRIBUTE, "true");
      root.hidden = true;
      root.innerHTML = `
        <svg class="cwm-picker-lasso" aria-hidden="true">
          <path class="cwm-picker-lasso-path"></path>
        </svg>
        <div class="cwm-picker-box"></div>
        <div class="cwm-picker-badge">圈选模式：移动鼠标高亮区域，单击选中或按住拖动画圈，Esc 取消</div>
      `;

      (document.body || document.documentElement).appendChild(root);

      state.picker.root = root;
      state.picker.lassoSvg = root.querySelector(".cwm-picker-lasso");
      state.picker.lassoPath = root.querySelector(".cwm-picker-lasso-path");
      state.picker.box = root.querySelector(".cwm-picker-box");
      state.picker.badge = root.querySelector(".cwm-picker-badge");
    }

    function startPickerMode({
      preservePrompt = true,
      reopenInlineAfterPick = true,
      reopenInlineOnCancel = false
    } = {}) {
      ensurePickerUi();

      state.picker.pendingPrompt =
        preservePrompt && state.inline.prompt ? String(state.inline.prompt.value ?? "") : "";
      state.picker.reopenInlineAfterPick = reopenInlineAfterPick;
      state.picker.reopenInlineOnCancel = reopenInlineOnCancel;
      state.picker.active = true;
      state.picker.currentElement = null;
      state.picker.root.hidden = false;
      resetPickerDrawState();
      state.picker.previousCursor = String(document.documentElement.style.cursor ?? "");
      document.documentElement.style.cursor = "crosshair";

      if (state.inline.root && !state.inline.root.hidden) {
        state.inline.root.hidden = true;
      }

      const fallbackElement =
        state.lastContextTarget?.element ||
        resolveContextElement(document.activeElement) ||
        document.body;
      updatePickerTarget(
        fallbackElement,
        Number.isFinite(state.lastContextTarget?.x) ? state.lastContextTarget.x : window.innerWidth * 0.5,
        Number.isFinite(state.lastContextTarget?.y) ? state.lastContextTarget.y : Math.min(window.innerHeight * 0.3, 160)
      );
    }

    function stopPickerMode({ reopenInline = false, targetElement = null, x = null, y = null } = {}) {
      if (state.picker.root) {
        state.picker.root.hidden = true;
      }

      resetPickerDrawState();
      state.picker.active = false;
      state.picker.currentElement = null;
      state.picker.reopenInlineOnCancel = false;
      document.documentElement.style.cursor = state.picker.previousCursor;
      state.picker.previousCursor = "";

      if (targetElement) {
        state.lastContextTarget = captureTargetContext(targetElement, {
          x: Number.isFinite(x) ? x : Math.round(window.innerWidth * 0.5),
          y: Number.isFinite(y) ? y : 96
        });
      }

      if (reopenInline) {
        openInlineEditor({}, {
          preservePrompt: true,
          promptValue: state.picker.pendingPrompt
        });
      }
    }

    function ensureInlineStyle() {
      if (document.getElementById(INLINE_STYLE_ID)) {
        return;
      }

      const style = document.createElement("style");
      style.id = INLINE_STYLE_ID;
      style.textContent = `
        #${INLINE_ROOT_ID}, #${INLINE_ROOT_ID} * {
          box-sizing: border-box;
        }

        #${INLINE_ROOT_ID} {
          position: fixed;
          top: 0;
          left: 0;
          z-index: 2147483646;
          font-family: "Segoe UI", "Microsoft YaHei", sans-serif;
        }

        #${INLINE_ROOT_ID}[hidden] {
          display: none !important;
        }

        #${PICKER_ROOT_ID} {
          position: fixed;
          inset: 0;
          z-index: 2147483645;
          pointer-events: none;
        }

        #${PICKER_ROOT_ID}[hidden] {
          display: none !important;
        }

        #${PICKER_ROOT_ID} .cwm-picker-box {
          position: fixed;
          border: 2px solid rgba(236, 119, 58, 0.98);
          border-radius: 14px;
          background: rgba(236, 119, 58, 0.1);
          box-shadow: 0 0 0 9999px rgba(24, 18, 13, 0.08);
        }

        #${PICKER_ROOT_ID} .cwm-picker-box[hidden],
        #${PICKER_ROOT_ID} .cwm-picker-lasso[hidden] {
          display: none !important;
        }

        #${PICKER_ROOT_ID} .cwm-picker-lasso {
          position: fixed;
          inset: 0;
          width: 100%;
          height: 100%;
          overflow: visible;
        }

        #${PICKER_ROOT_ID} .cwm-picker-lasso-path {
          fill: none;
          stroke: rgba(236, 119, 58, 0.98);
          stroke-width: 3;
          stroke-linecap: round;
          stroke-linejoin: round;
          vector-effect: non-scaling-stroke;
          filter: drop-shadow(0 10px 24px rgba(32, 22, 14, 0.2));
        }

        #${PICKER_ROOT_ID} .cwm-picker-badge {
          position: fixed;
          max-width: min(340px, calc(100vw - 24px));
          padding: 8px 12px;
          border-radius: 12px;
          background: rgba(32, 22, 14, 0.94);
          color: #fff8f2;
          font-size: 12px;
          line-height: 1.4;
          box-shadow: 0 14px 40px rgba(0, 0, 0, 0.2);
        }

        #${DRAG_MODE_ROOT_ID} {
          position: fixed;
          top: 0;
          left: 0;
          z-index: 2147483646;
          font-family: "Segoe UI", "Microsoft YaHei", sans-serif;
        }

        #${DRAG_MODE_ROOT_ID}[hidden] {
          display: none !important;
        }

        .cwm-drag-live-layer {
          position: fixed;
          top: 0;
          left: 0;
          z-index: 2147483646;
          min-width: 168px;
          max-width: min(260px, calc(100vw - 20px));
          border-radius: 16px;
          border: 1px solid rgba(189, 162, 135, 0.95);
          background: linear-gradient(180deg, rgba(255, 251, 246, 0.98) 0%, rgba(247, 237, 225, 0.98) 100%);
          color: #2a211a;
          box-shadow: 0 18px 42px rgba(32, 22, 14, 0.18);
          padding: 10px 12px;
          font-family: "Segoe UI", "Microsoft YaHei", sans-serif;
          pointer-events: none;
          backdrop-filter: blur(10px);
        }

        .cwm-drag-live-layer[hidden] {
          display: none !important;
        }

        .cwm-drag-live-layer-label {
          margin: 0;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          color: #977a63;
        }

        .cwm-drag-live-layer-value {
          margin: 4px 0 0;
          font-size: 18px;
          font-weight: 800;
          line-height: 1.2;
        }

        .cwm-drag-live-layer-hint {
          margin: 6px 0 0;
          font-size: 12px;
          line-height: 1.45;
          color: #705d50;
        }

        #${DRAG_MODE_ROOT_ID} .cwm-drag-mode-panel {
          width: min(320px, calc(100vw - 24px));
          border-radius: 18px;
          border: 1px solid rgba(189, 162, 135, 0.9);
          background: linear-gradient(180deg, rgba(255, 251, 246, 0.98) 0%, rgba(247, 237, 225, 0.98) 100%);
          color: #2a211a;
          box-shadow: 0 20px 60px rgba(32, 22, 14, 0.22);
          padding: 14px;
          backdrop-filter: blur(12px);
        }

        #${DRAG_MODE_ROOT_ID} .cwm-drag-mode-eyebrow {
          margin: 0;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: #9a7f67;
        }

        #${DRAG_MODE_ROOT_ID} .cwm-drag-mode-title {
          margin: 6px 0 0;
          font-size: 18px;
          line-height: 1.25;
        }

        #${DRAG_MODE_ROOT_ID} .cwm-drag-mode-status {
          margin: 10px 0 0;
          font-size: 13px;
          line-height: 1.5;
          color: #6f5f52;
          word-break: break-word;
        }

        #${DRAG_MODE_ROOT_ID} .cwm-drag-mode-layer {
          margin-top: 12px;
          padding: 12px;
          border-radius: 14px;
          border: 1px solid rgba(214, 190, 164, 0.95);
          background: rgba(255, 255, 255, 0.7);
        }

        #${DRAG_MODE_ROOT_ID} .cwm-drag-mode-layer-header {
          display: flex;
          align-items: baseline;
          justify-content: space-between;
          gap: 12px;
        }

        #${DRAG_MODE_ROOT_ID} .cwm-drag-mode-layer-label {
          margin: 0;
          font-size: 12px;
          font-weight: 700;
          color: #8b6f58;
          letter-spacing: 0.04em;
          text-transform: uppercase;
        }

        #${DRAG_MODE_ROOT_ID} .cwm-drag-mode-layer-value {
          margin: 0;
          font-size: 18px;
          font-weight: 800;
          color: #2a211a;
        }

        #${DRAG_MODE_ROOT_ID} .cwm-drag-mode-layer-hint {
          margin: 8px 0 0;
          font-size: 12px;
          line-height: 1.5;
          color: #7a6758;
        }

        #${DRAG_MODE_ROOT_ID} .cwm-drag-mode-layer-actions {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 8px;
          margin-top: 10px;
        }

        #${DRAG_MODE_ROOT_ID} .cwm-drag-mode-layer-btn {
          appearance: none;
          border-radius: 12px;
          padding: 9px 10px;
          font: inherit;
          font-size: 13px;
          font-weight: 700;
          cursor: pointer;
          background: rgba(255, 248, 242, 0.95);
          color: #2a211a;
          border: 1px solid rgba(205, 179, 153, 0.95);
        }

        #${DRAG_MODE_ROOT_ID} .cwm-drag-mode-layer-btn[disabled] {
          opacity: 0.46;
          cursor: not-allowed;
        }

        #${DRAG_MODE_ROOT_ID} .cwm-drag-mode-actions {
          display: grid;
          gap: 10px;
          margin-top: 14px;
        }

        #${DRAG_MODE_ROOT_ID} .cwm-drag-mode-primary,
        #${DRAG_MODE_ROOT_ID} .cwm-drag-mode-secondary,
        #${DRAG_MODE_ROOT_ID} .cwm-drag-mode-cancel {
          appearance: none;
          border-radius: 14px;
          padding: 10px 14px;
          font: inherit;
          font-weight: 700;
          cursor: pointer;
        }

        #${DRAG_MODE_ROOT_ID} .cwm-drag-mode-primary {
          border: 0;
          background: #cf713e;
          color: #fffaf7;
        }

        #${DRAG_MODE_ROOT_ID} .cwm-drag-mode-secondary,
        #${DRAG_MODE_ROOT_ID} .cwm-drag-mode-cancel {
          background: rgba(255, 255, 255, 0.82);
          color: #2a211a;
          border: 1px solid rgba(205, 179, 153, 0.95);
        }

        #${INLINE_ROOT_ID} .cwm-inline-panel {
          position: relative;
          width: min(420px, calc(100vw - 24px));
          max-height: calc(100vh - 32px);
          overflow: auto;
          overscroll-behavior: contain;
          border-radius: 18px;
          border: 1px solid rgba(189, 162, 135, 0.9);
          background: linear-gradient(180deg, rgba(255, 251, 246, 0.98) 0%, rgba(247, 237, 225, 0.98) 100%);
          color: #2a211a;
          box-shadow: 0 20px 60px rgba(32, 22, 14, 0.2);
          padding: 14px;
          backdrop-filter: blur(12px);
        }

        #${INLINE_ROOT_ID} .cwm-inline-panel::after {
          content: "";
          position: absolute;
          left: 18px;
          top: -7px;
          width: 14px;
          height: 14px;
          background: rgba(255, 251, 246, 0.98);
          border-left: 1px solid rgba(189, 162, 135, 0.9);
          border-top: 1px solid rgba(189, 162, 135, 0.9);
          transform: rotate(45deg);
        }

        #${INLINE_ROOT_ID}[data-placement="top"] .cwm-inline-panel::after {
          top: auto;
          bottom: -7px;
          border-left: 0;
          border-top: 0;
          border-right: 1px solid rgba(189, 162, 135, 0.9);
          border-bottom: 1px solid rgba(189, 162, 135, 0.9);
        }

        #${INLINE_ROOT_ID} .cwm-inline-header,
        #${INLINE_ROOT_ID} .cwm-inline-actions {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 10px;
        }

        #${INLINE_ROOT_ID} .cwm-inline-header {
          align-items: flex-start;
        }

        #${INLINE_ROOT_ID} .cwm-inline-header-actions {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        #${INLINE_ROOT_ID} .cwm-inline-eyebrow,
        #${INLINE_ROOT_ID} .cwm-inline-target-label,
        #${INLINE_ROOT_ID} .cwm-inline-field span {
          margin: 0;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: #9a7f67;
        }

        #${INLINE_ROOT_ID} .cwm-inline-title {
          margin: 4px 0 0;
          font-size: 22px;
          line-height: 1.1;
        }

        #${INLINE_ROOT_ID} .cwm-inline-close,
        #${INLINE_ROOT_ID} .cwm-inline-settings,
        #${INLINE_ROOT_ID} .cwm-inline-pick,
        #${INLINE_ROOT_ID} .cwm-inline-primary,
        #${INLINE_ROOT_ID} .cwm-inline-secondary {
          appearance: none;
          border: 0;
          border-radius: 14px;
          cursor: pointer;
          font: inherit;
        }

        #${INLINE_ROOT_ID} .cwm-inline-settings {
          width: 34px;
          height: 34px;
          border-radius: 999px;
          background: rgba(255, 255, 255, 0.82);
          color: #4b3728;
          font-size: 16px;
          line-height: 1;
          border: 1px solid rgba(205, 179, 153, 0.95);
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 0;
        }

        #${INLINE_ROOT_ID} .cwm-inline-close {
          width: 34px;
          height: 34px;
          background: rgba(255, 255, 255, 0.72);
          color: #4b3728;
          font-size: 22px;
          line-height: 1;
        }

        #${INLINE_ROOT_ID} .cwm-inline-pick {
          min-height: 34px;
          padding: 0 12px;
          background: rgba(255, 255, 255, 0.82);
          color: #4b3728;
          font-size: 13px;
          font-weight: 700;
          border: 1px solid rgba(205, 179, 153, 0.95);
        }

        #${INLINE_ROOT_ID} .cwm-inline-target,
        #${INLINE_ROOT_ID} .cwm-inline-field,
        #${INLINE_ROOT_ID} .cwm-inline-theme,
        #${INLINE_ROOT_ID} .cwm-inline-component,
        #${INLINE_ROOT_ID} .cwm-inline-details {
          display: grid;
          gap: 8px;
          margin-top: 12px;
          padding: 12px;
          border-radius: 14px;
          background: rgba(255, 255, 255, 0.72);
          border: 1px solid rgba(219, 197, 173, 0.9);
        }

        #${INLINE_ROOT_ID} .cwm-inline-target-title,
        #${INLINE_ROOT_ID} .cwm-inline-target-meta,
        #${INLINE_ROOT_ID} .cwm-inline-status {
          margin: 0;
          font-size: 13px;
          line-height: 1.45;
        }

        #${INLINE_ROOT_ID} .cwm-inline-target-title {
          font-weight: 700;
        }

        #${INLINE_ROOT_ID} .cwm-inline-target-meta {
          color: #6f5f52;
          word-break: break-word;
        }

        #${INLINE_ROOT_ID} .cwm-inline-prompt {
          width: 100%;
          min-height: 104px;
          resize: vertical;
          border-radius: 12px;
          border: 1px solid rgba(205, 179, 153, 0.95);
          background: #fffdfa;
          color: #2a211a;
          padding: 10px 12px;
          font: inherit;
          line-height: 1.5;
        }

        #${INLINE_ROOT_ID} .cwm-inline-theme-search,
        #${INLINE_ROOT_ID} .cwm-inline-theme-tone,
        #${INLINE_ROOT_ID} .cwm-inline-theme-select,
        #${INLINE_ROOT_ID} .cwm-inline-component-search,
        #${INLINE_ROOT_ID} .cwm-inline-component-category,
        #${INLINE_ROOT_ID} .cwm-inline-component-scope,
        #${INLINE_ROOT_ID} .cwm-inline-component-motion-mode,
        #${INLINE_ROOT_ID} .cwm-inline-component-motion,
        #${INLINE_ROOT_ID} .cwm-inline-component-select {
          width: 100%;
          min-height: 36px;
          border-radius: 12px;
          border: 1px solid rgba(205, 179, 153, 0.95);
          background: #fffdfa;
          color: #2a211a;
          padding: 6px 10px;
          font: inherit;
        }

        #${INLINE_ROOT_ID} .cwm-inline-theme-actions,
        #${INLINE_ROOT_ID} .cwm-inline-component-actions {
          display: flex;
          align-items: center;
          flex-wrap: wrap;
          gap: 8px;
        }

        #${INLINE_ROOT_ID} .cwm-inline-actions {
          margin-top: 12px;
          justify-content: flex-start;
          flex-wrap: wrap;
        }

        #${INLINE_ROOT_ID} .cwm-inline-primary,
        #${INLINE_ROOT_ID} .cwm-inline-secondary {
          padding: 10px 14px;
          font-weight: 700;
        }

        #${INLINE_ROOT_ID} .cwm-inline-primary {
          background: #cf713e;
          color: #fffaf7;
        }

        #${INLINE_ROOT_ID} .cwm-inline-secondary {
          background: rgba(255, 255, 255, 0.8);
          color: #2a211a;
          border: 1px solid rgba(205, 179, 153, 0.95);
        }

        #${INLINE_ROOT_ID} button[disabled] {
          opacity: 0.55;
          cursor: default;
        }

        #${INLINE_ROOT_ID} .cwm-inline-status {
          margin-top: 10px;
          color: #7a5e49;
        }

        #${INLINE_ROOT_ID} .cwm-inline-status[data-tone="error"] {
          color: #b14545;
        }

        #${INLINE_ROOT_ID} .cwm-inline-status[data-tone="success"] {
          color: #256d45;
        }

        #${INLINE_ROOT_ID} .cwm-inline-status[data-tone="info"] {
          color: #7a5e49;
        }

        #${INLINE_ROOT_ID} .cwm-inline-details summary {
          cursor: pointer;
          font-size: 13px;
          font-weight: 700;
        }

        #${INLINE_ROOT_ID} .cwm-inline-output {
          margin: 0;
          border-radius: 12px;
          padding: 12px;
          background: rgba(245, 236, 223, 0.7);
          color: #2a211a;
          font-size: 13px;
          line-height: 1.5;
          white-space: pre-wrap;
          word-break: break-word;
        }
      `;

      (document.head || document.documentElement).appendChild(style);
    }

    async function generateInlinePreview() {
      const instruction = String(state.inline.prompt?.value ?? "").trim();
      if (!instruction) {
        setInlineStatus("先输入你想改成什么。", "error");
        return;
      }

      if (!state.lastContextTarget) {
        setInlineStatus("没有找到当前右键目标，请重新右键后再试。", "error");
        return;
      }

      // 自动检测全页意图（已是 pageTheme 模式则跳过，防止循环）
      const PAGE_THEME_PATTERN = /整[个页面站]|全[页站页面]|整站|页面风格|网页风格|整体风格|全局|整个网页|整个页面|whole.?page|full.?page|entire.?page|site.?theme|page.?theme/i;
      const isAutoPageTheme = PAGE_THEME_PATTERN.test(instruction) && !state.lastContextTarget?.isPageTheme;
      if (isAutoPageTheme) {
        setInlineStatus("检测到全页风格需求，已自动切换为整页改色模式...", "info");
        activatePageThemeMode();
        return;
      }

      setInlineBusy(true);
      setInlineStatus("正在生成针对当前目标的修改规则...", "info");

      try {
        const response = await sendRuntimeMessage({
          type: "rules:generate",
          instruction,
          forcePreview: true,
          targetContext: serializeTargetContext()
        });

        state.inline.generatedRuleSet = response.ruleSet;
        const generationSource = String(response?.generationSource ?? "").trim();
        const sourceLabel =
          generationSource === "ai"
            ? "AI 生成"
            : generationSource === "local-deterministic"
              ? "本地确定性规则（未调用 AI）"
              : generationSource === "local-fallback-after-ai-error"
                ? "本地兜底（AI 请求失败）"
                : generationSource === "local-fallback-after-ai-empty"
                  ? "本地兜底（AI 未产出可用规则）"
                  : generationSource
                    ? "本地兜底（AI 不可用或未命中）"
                    : "来源未知";
        state.inline.output.textContent = `[${sourceLabel}]\n${buildInlineRuleNarrative(response.ruleSet)}`;
        syncInlineButtons();
        setInlineStatus("已生成并预览，你可以继续微调或直接保存到本站。", "success");
      } catch (error) {
        state.inline.generatedRuleSet = null;
        state.inline.output.textContent = formatInlineError(error);
        syncInlineButtons();
        setInlineStatus(`生成失败：${formatInlineError(error)}`, "error");
      } finally {
        setInlineBusy(false);
      }
    }

    async function saveInlineRuleSet() {
      if (!state.inline.generatedRuleSet) {
        setInlineStatus("先生成一个可预览的结果，再保存。", "error");
        return;
      }

      setInlineBusy(true);
      setInlineStatus("正在保存到当前网站规则集...", "info");

      try {
        await sendRuntimeMessage({
          type: "rules:save",
          merge: true,
          ruleSet: state.inline.generatedRuleSet
        });

        setInlineStatus("已保存。以后打开这个网站时，这条修改会自动生效。", "success");
      } catch (error) {
        setInlineStatus(`保存失败：${formatInlineError(error)}`, "error");
      } finally {
        setInlineBusy(false);
      }
    }

    async function clearInlinePreview() {
      setInlineBusy(true);

      try {
        await sendRuntimeMessage({
          type: "rules:clear-preview"
        });

        setInlineStatus("当前预览已经清除。", "success");
      } catch (error) {
        setInlineStatus(`清除失败：${formatInlineError(error)}`, "error");
      } finally {
        setInlineBusy(false);
      }
    }

    async function openInlineSettingsPage() {
      try {
        await sendRuntimeMessage({ type: "options:open" });
      } catch (error) {
        setInlineStatus(`打开设置失败：${formatInlineError(error)}`, "error");
      }
    }

    function queueInlineThemePreview() {
      if (state.inline.themePreviewTimer) {
        window.clearTimeout(state.inline.themePreviewTimer);
      }

      state.inline.themePreviewTimer = window.setTimeout(() => {
        state.inline.themePreviewTimer = null;
        void previewInlineThemeTemplate({ silentStatus: true });
      }, 24);
    }

    async function previewInlineThemeTemplate({ silentStatus = false } = {}) {
      const selectedTheme = getSelectedInlineThemeTemplate();
      if (!selectedTheme) {
        setInlineStatus("先选择一个主题模板。", "error");
        return;
      }

      if (state.inline.lastThemePreviewId === selectedTheme.id && state.previewRuleSet) {
        if (!silentStatus) {
          setInlineStatus(`主题已是当前预览：${selectedTheme.name}`, "success");
        }
        return;
      }

      const themeRuleSet = buildInlineThemeTemplateRuleSet(selectedTheme);
      state.previewRuleSet = sanitizeRuleSet(themeRuleSet);
      state.inline.generatedRuleSet = themeRuleSet;
      state.inline.lastThemePreviewId = selectedTheme.id;
      applyThemeSwitchGuard();
      state.inline.themeSwitchGuardUntil = Date.now() + 240;
      scheduleApply();
      syncInlineButtons();
      if (!silentStatus) {
        setInlineStatus(`已预览主题：${selectedTheme.name}`, "success");
      }
    }

    async function saveInlineThemeTemplate() {
      const selectedTheme = getSelectedInlineThemeTemplate();
      if (!selectedTheme) {
        setInlineStatus("先选择一个主题模板。", "error");
        return;
      }

      const themeRuleSet = buildInlineThemeTemplateRuleSet(selectedTheme);
      setInlineBusy(true);
      setInlineStatus(`正在保存主题：${selectedTheme.name}...`, "info");

      try {
        const sanitizedThemeRuleSet = sanitizeRuleSet(themeRuleSet);
        state.previewRuleSet = sanitizedThemeRuleSet;
        state.inline.generatedRuleSet = themeRuleSet;
        state.inline.lastThemePreviewId = selectedTheme.id;
        applyThemeSwitchGuard();
        state.inline.themeSwitchGuardUntil = Date.now() + 240;
        scheduleApply();

        const nonCustomCssSavedRules = (state.savedRuleSet?.rules ?? []).filter(
          (rule) => rule?.type !== "customCss"
        );
        const replaceRuleSet = sanitizeRuleSet({
          hostname: getSiteKey(),
          summary: `应用主题模板：${selectedTheme.name}`,
          rules: [...nonCustomCssSavedRules, ...sanitizedThemeRuleSet.rules]
        });

        const response = await sendRuntimeMessage({
          type: "rules:save",
          merge: false,
          ruleSet: replaceRuleSet
        });
        state.savedRuleSet = sanitizeRuleSet(response?.ruleSet);
        state.previewRuleSet = null;
        setInlineStatus(`主题已保存：${selectedTheme.name}`, "success");
      } catch (error) {
        setInlineStatus(`主题保存失败：${formatInlineError(error)}`, "error");
      } finally {
        scheduleApply();
        syncInlineButtons();
        setInlineBusy(false);
      }
    }

    function queueInlineComponentPreview() {
      if (state.inline.componentPreviewTimer) {
        window.clearTimeout(state.inline.componentPreviewTimer);
      }

      state.inline.componentPreviewTimer = window.setTimeout(() => {
        state.inline.componentPreviewTimer = null;
        void previewInlineComponentTemplate({ silentStatus: true });
      }, 24);
    }

    async function previewInlineComponentTemplate({ silentStatus = false } = {}) {
      if (!state.lastContextTarget?.selector) {
        setInlineStatus("先圈选一个目标元素，再预览组件。", "error");
        return;
      }

      const selectedComponent = getSelectedInlineComponentTemplate();
      if (!selectedComponent) {
        setInlineStatus("先选择一个组件模板。", "error");
        return;
      }

      const scope = normalizeInlineComponentScope(state.inline.componentScopeSelect?.value);
      const motionPreset = getInlineComponentMotionPreset();
      const selector = resolveComponentScopeSelector(state.lastContextTarget, scope, selectedComponent);
      const cacheKey = `${selectedComponent.id}::${scope}::${motionPreset}::${selector}`;
      if (state.inline.lastComponentPreviewId === cacheKey && state.previewRuleSet) {
        if (!silentStatus) {
          setInlineStatus(`组件已是当前预览：${selectedComponent.name}`, "success");
        }
        return;
      }

      const componentRuleSet = buildInlineComponentTemplateRuleSet(selectedComponent, state.lastContextTarget);
      if (!componentRuleSet) {
        setInlineStatus("当前目标不适合整页同类替换，请先选中具体组件后再试。", "error");
        return;
      }
      state.previewRuleSet = sanitizeRuleSet(componentRuleSet);
      state.inline.generatedRuleSet = componentRuleSet;
      state.inline.lastComponentPreviewId = cacheKey;
      scheduleApply();
      syncInlineButtons();
      if (!silentStatus) {
        setInlineStatus(`已预览组件：${selectedComponent.name}`, "success");
      }
    }

    async function saveInlineComponentTemplate() {
      if (!state.lastContextTarget?.selector) {
        setInlineStatus("先圈选一个目标元素，再保存组件。", "error");
        return;
      }

      const selectedComponent = getSelectedInlineComponentTemplate();
      if (!selectedComponent) {
        setInlineStatus("先选择一个组件模板。", "error");
        return;
      }

      const componentRuleSet = buildInlineComponentTemplateRuleSet(selectedComponent, state.lastContextTarget);
      if (!componentRuleSet) {
        setInlineStatus("当前目标不适合整页同类替换，请先选中具体组件后再试。", "error");
        return;
      }
      setInlineBusy(true);
      setInlineStatus(`正在保存组件：${selectedComponent.name}...`, "info");

      try {
        state.previewRuleSet = sanitizeRuleSet(componentRuleSet);
        state.inline.generatedRuleSet = componentRuleSet;
        scheduleApply();

        const nonComponentSavedRules = (state.savedRuleSet?.rules ?? []).filter(
          (rule) => !isInlineComponentTemplateRule(rule)
        );
        const replaceRuleSet = sanitizeRuleSet({
          hostname: getSiteKey(),
          summary: `应用组件模板：${selectedComponent.name}`,
          rules: [...nonComponentSavedRules, ...(componentRuleSet.rules ?? [])]
        });
        const response = await sendRuntimeMessage({
          type: "rules:save",
          merge: false,
          ruleSet: replaceRuleSet
        });
        state.savedRuleSet = sanitizeRuleSet(response?.ruleSet);
        state.previewRuleSet = null;
        setInlineStatus(`组件已保存：${selectedComponent.name}`, "success");
      } catch (error) {
        setInlineStatus(`组件保存失败：${formatInlineError(error)}`, "error");
      } finally {
        scheduleApply();
        syncInlineButtons();
        setInlineBusy(false);
      }
    }

    // ── 改整页风格 ──────────────────────────────────────────────────────────
    function activatePageThemeMode() {
      const instruction = String(state.inline.prompt?.value ?? "").trim();
      if (!instruction) {
        setInlineStatus("先输入你想要的整页风格，例如：改成深色赛博朋克风格。", "error");
        return;
      }

      // 强制把 target 设为 body，带页面主题标记
      state.lastContextTarget = {
        selector: "body",
        tagName: "body",
        text: "",
        href: "",
        src: "",
        selectedText: "",
        mediaType: "",
        x: Math.round(window.innerWidth * 0.5),
        y: Math.round(window.innerHeight * 0.5),
        isPageTheme: true
      };

      void generateInlinePreview();
    }

    // ── 拖拽排版 ────────────────────────────────────────────────────────────
    const DRAG_ATTR = "data-cwm-drag-pos";
    const DRAG_OVERLAY_ID = "cwm-drag-overlay";
    const DRAG_THRESHOLD_PX = 5;
    const DRAG_DROP_INDICATOR_ID = "cwm-drag-drop-indicator";
    const DRAG_CONTAINER_TAGS = new Set([
      "body",
      "main",
      "nav",
      "aside",
      "section",
      "article",
      "div",
      "ul",
      "ol",
      "menu",
      "header",
      "footer",
      "form"
    ]);
    const DRAG_CONTAINER_ROLES = new Set([
      "navigation",
      "list",
      "menu",
      "tablist",
      "toolbar",
      "tree",
      "grid",
      "group",
      "region"
    ]);
    const DRAG_PREFERRED_TAGS = new Set([
      "a",
      "button",
      "li",
      "article",
      "section",
      "aside",
      "nav",
      "header",
      "footer",
      "main",
      "div"
    ]);
    const DRAG_PREFERRED_ROLES = new Set([
      "button",
      "link",
      "menuitem",
      "tab",
      "listitem",
      "treeitem"
    ]);
    const DRAG_INTERACTIVE_CONTAINER_TAGS = new Set([
      "button",
      "a",
      "input",
      "textarea",
      "select",
      "label",
      "option"
    ]);
    const DRAG_INTERACTIVE_CONTAINER_ROLES = new Set([
      "button",
      "link",
      "menuitem",
      "tab",
      "option",
      "treeitem"
    ]);

    function toggleDragMode() {
      state.drag.active = !state.drag.active;
      syncInlineButtons();

      if (state.drag.active) {
        enableDragMode();
        setInlineStatus("拖拽模式已开启：可跨容器拖动页面元素重新排版，松手后可选择跟随页面滚动或固定在屏幕上。", "info");
      } else {
        disableDragMode();
        setInlineStatus("拖拽模式已关闭。", "success");
      }
    }

    function enableDragMode() {
      document.addEventListener("mousedown", handleDragMouseDown, true);
      document.addEventListener("mousemove", handleDragMouseMove, true);
      document.addEventListener("mouseup", handleDragMouseUp, true);
      document.addEventListener("wheel", handleDragWheel, true);
      document.addEventListener("pointercancel", handleDragPointerCancel, true);
      document.body.style.setProperty("cursor", "grab", "important");
    }

    function disableDragMode() {
      document.removeEventListener("mousedown", handleDragMouseDown, true);
      document.removeEventListener("mousemove", handleDragMouseMove, true);
      document.removeEventListener("mouseup", handleDragMouseUp, true);
      document.removeEventListener("wheel", handleDragWheel, true);
      document.removeEventListener("pointercancel", handleDragPointerCancel, true);
      document.body.style.removeProperty("cursor");
      handleDragPointerCancel();
    }

    function handleDragMouseDown(event) {
      if (event.button !== 0) {
        return;
      }

      if (!(event.target instanceof Element)) {
        return;
      }

      if (isExtensionOwnedElement(event.target)) {
        return;
      }

      if (state.drag.modeRoot && !state.drag.modeRoot.hidden) {
        return;
      }

      const realEl = resolveMovableBlock(event.target);
      if (!realEl || realEl === document.body || realEl === document.documentElement) {
        return;
      }

      event.preventDefault();
      event.stopPropagation();
      event.stopImmediatePropagation();

      state.drag.pendingTarget = realEl;
      state.drag.startX = event.clientX;
      state.drag.startY = event.clientY;
      state.drag.dragging = false;
      state.drag.target = null;
      state.drag.suppressClick = false;
      state.drag.suppressClickTarget = null;
      state.drag.suppressClickUntil = 0;
    }

    function handleDragClick(event) {
      if (!state.drag.suppressClick) {
        return;
      }

      if (Date.now() > state.drag.suppressClickUntil) {
        state.drag.suppressClick = false;
        state.drag.suppressClickTarget = null;
        state.drag.suppressClickUntil = 0;
        return;
      }

      event.preventDefault();
      event.stopPropagation();
      event.stopImmediatePropagation();

      state.drag.suppressClick = false;
      state.drag.suppressClickTarget = null;
      state.drag.suppressClickUntil = 0;
    }

    function handleDragPointerCancel() {
      closeDragSaveModeChooser();
      closeLiveDragLayerBadge();

      const target = state.drag.target;
      const placeholder = state.drag.placeholder;

      if (target) {
        restoreDraggedElementDomPosition(target);
        restoreDraggedElementState(target);
      }

      if (placeholder) {
        if (state.drag.placeholderWasExisting) {
          finalizePlaceholderAppearance(placeholder);
        } else {
          placeholder.remove();
        }
      }

      state.drag.placeholder = null;
      state.drag.placeholderWasExisting = false;
      state.drag.originalStyles = null;
      state.drag.currentDropContainer = null;
      state.drag.dragging = false;
      state.drag.target = null;
      state.drag.pendingTarget = null;
      state.drag.sourceSelector = "";
      state.drag.startedInViewportHost = false;
      state.drag.parent = null;
      state.drag.insertRef = null;
      state.drag.insertBefore = true;
      removeDragDropIndicator();

      if (state.drag.active) {
        document.body.style.setProperty("cursor", "grab", "important");
      }
    }

    function handleDragMouseMove(event) {
      if (!state.drag.pendingTarget && !state.drag.dragging) {
        return;
      }

      const dx = event.clientX - state.drag.startX;
      const dy = event.clientY - state.drag.startY;

      if (!state.drag.dragging) {
        if (Math.sqrt(dx * dx + dy * dy) < DRAG_THRESHOLD_PX) {
          return;
        }

        const el = resolveMovableBlock(state.drag.pendingTarget);
        state.drag.pendingTarget = null;
        if (!el) {
          return;
        }

        beginDragGesture(el, event.clientX, event.clientY);
      }

      event.preventDefault();
      event.stopPropagation();

      positionDraggedPreview(event.clientX, event.clientY);
    }

    function handleDragWheel(event) {
      if (!state.drag.dragging) {
        return;
      }

      event.preventDefault();
      event.stopPropagation();
      event.stopImmediatePropagation();

      if (event.deltaY < 0) {
        setDragLayer(getCurrentDragLayer() + 1);
      } else if (event.deltaY > 0) {
        setDragLayer(getCurrentDragLayer() - 1);
      }

      positionLiveDragLayerBadge(event.clientX, event.clientY);
    }

    function handleDragMouseUp(event) {
      if (!state.drag.dragging && state.drag.pendingTarget) {
        state.drag.pendingTarget = null;
        return;
      }

      if (!state.drag.dragging || !state.drag.target) {
        state.drag.pendingTarget = null;
        return;
      }

      event.preventDefault();
      event.stopPropagation();

      const el = state.drag.target;
      const selector = state.drag.sourceSelector || buildSelector(el);
      finalizePinnedElement(el);
      state.drag.pendingFollowDragRule = buildPagePinNodeDragRule(selector, el);
      state.drag.pendingFixedDragRule = buildPinNodeDragRule(selector, el);
      closeLiveDragLayerBadge();
      openDragSaveModeChooser(el, event.clientX, event.clientY);

      state.drag.suppressClick = true;
      state.drag.suppressClickTarget = el;
      state.drag.suppressClickUntil = Date.now() + 400;
      state.drag.dragging = false;
      state.drag.pendingTarget = null;

      if (state.drag.active) {
        document.body.style.setProperty("cursor", "grab", "important");
      }
    }

    function beginDragGesture(el, clientX, clientY) {
      const rect = el.getBoundingClientRect();
      state.drag.sourceSelector =
        String(el.getAttribute(PIN_SOURCE_ATTRIBUTE) ?? "").trim() || buildSelector(el);
      state.drag.wasPinnedBeforeDrag =
        Boolean(state.drag.sourceSelector) &&
        (Boolean(findPinnedPlaceholder(state.drag.sourceSelector)) ||
          String(el.style.position ?? "").trim() === "fixed" ||
          el.hasAttribute(PIN_SOURCE_ATTRIBUTE));
      const existingPlaceholder = findPinnedPlaceholder(state.drag.sourceSelector);
      const placeholder = existingPlaceholder || createPlaceholderForPinnedElement(el, {
        preview: true,
        sourceSelector: state.drag.sourceSelector,
        width: rect.width,
        height: rect.height
      });

      state.drag.placeholderWasExisting = Boolean(existingPlaceholder);
      state.drag.originalStyles = captureElementStyles(el);

      if (!placeholder.parentElement) {
        el.parentElement?.insertBefore(placeholder, el);
      } else {
        placeholder.style.visibility = "visible";
      }

      state.drag.placeholder = placeholder;
      state.drag.target = el;
      state.drag.parent = el.parentElement;
      state.drag.currentDropContainer = el.parentElement;
      state.drag.startedInViewportHost = el.parentElement === (document.body || document.documentElement);
      const pointerOffset = resolveDragPointerOffset(el, rect, clientX, clientY);

      state.drag.dragging = true;
      state.drag.offsetX = pointerOffset.offsetX;
      state.drag.offsetY = pointerOffset.offsetY;
      state.drag.origLeft = rect.left;
      state.drag.origTop = rect.top;

      promotePinnedElementToViewportHost(el);
      styleDraggedPreview(el, rect);
      openLiveDragLayerBadge(el);
      positionDraggedPreview(clientX, clientY);
      document.body.style.setProperty("cursor", "grabbing", "important");
    }

    function createPlaceholderForPinnedElement(element, {
      preview = false,
      sourceSelector = "",
      width = null,
      height = null
    } = {}) {
      const rect = element.getBoundingClientRect();
      const cs = window.getComputedStyle(element);
      const placeholder = document.createElement("div");
      placeholder.setAttribute(OWNED_ATTRIBUTE, "true");
      placeholder.setAttribute(DRAG_ATTR, "placeholder");
      placeholder.setAttribute(PIN_PLACEHOLDER_ATTRIBUTE, String(sourceSelector ?? ""));
      placeholder.setAttribute("aria-hidden", "true");
      placeholder.style.cssText = [
        `display:${cs.display === "inline" ? "inline-block" : cs.display}`,
        `width:${Math.max(16, Number.isFinite(width) ? width : rect.width)}px`,
        `height:${Math.max(16, Number.isFinite(height) ? height : rect.height)}px`,
        `min-width:${Math.max(16, Number.isFinite(width) ? width : rect.width)}px`,
        `min-height:${Math.max(16, Number.isFinite(height) ? height : rect.height)}px`,
        `margin:${cs.margin}`,
        `box-sizing:border-box`,
        preview ? `border:2px dashed rgba(22,119,255,0.88)` : `border:0`,
        `border-radius:${cs.borderRadius || "10px"}`,
        preview ? `background:rgba(22,119,255,0.08)` : `background:transparent`,
        `pointer-events:none`,
        `flex-shrink:${cs.flexShrink}`
      ].join(";");

      if (!preview) {
        finalizePlaceholderAppearance(placeholder);
      }

      return placeholder;
    }

    function styleDraggedPreview(el, rect) {
      const previewLayer = getCurrentDragLayer(el);
      el.setAttribute(DRAG_ATTR, "active");
      el.setAttribute(PIN_SOURCE_ATTRIBUTE, state.drag.sourceSelector);
      el.style.position = "fixed";
      el.style.left = `${rect.left}px`;
      el.style.top = `${rect.top}px`;
      el.style.width = `${rect.width}px`;
      el.style.height = `${rect.height}px`;
      el.style.margin = "0";
      el.style.zIndex = `${dragLayerToZIndex(previewLayer)}`;
      el.style.boxSizing = "border-box";
      el.style.pointerEvents = "none";
      el.style.outline = "2px dashed #1677ff";
      el.style.opacity = "0.9";
      el.style.boxShadow = "0 14px 40px rgba(0,0,0,0.22)";
      el.style.maxWidth = `${Math.max(rect.width, 16)}px`;
    }

    function clearDraggedPreviewStyles(el) {
      el.removeAttribute(DRAG_ATTR);
      el.style.position = "";
      el.style.left = "";
      el.style.top = "";
      el.style.width = "";
      el.style.height = "";
      el.style.margin = "";
      el.style.zIndex = "";
      el.style.boxSizing = "";
      el.style.pointerEvents = "";
      el.style.outline = "";
      el.style.opacity = "";
      el.style.boxShadow = "";
      el.style.maxWidth = "";
    }

    function captureElementStyles(el) {
      return {
        position: el.style.position,
        left: el.style.left,
        top: el.style.top,
        width: el.style.width,
        height: el.style.height,
        margin: el.style.margin,
        zIndex: el.style.zIndex,
        boxSizing: el.style.boxSizing,
        pointerEvents: el.style.pointerEvents,
        outline: el.style.outline,
        opacity: el.style.opacity,
        boxShadow: el.style.boxShadow,
        maxWidth: el.style.maxWidth
      };
    }

    function restoreDraggedElementState(el) {
      const originalStyles = state.drag.originalStyles;
      if (!originalStyles) {
        clearDraggedPreviewStyles(el);
        return;
      }

      el.removeAttribute(DRAG_ATTR);
      el.style.position = originalStyles.position;
      el.style.left = originalStyles.left;
      el.style.top = originalStyles.top;
      el.style.width = originalStyles.width;
      el.style.height = originalStyles.height;
      el.style.margin = originalStyles.margin;
      el.style.zIndex = originalStyles.zIndex;
      el.style.boxSizing = originalStyles.boxSizing;
      el.style.pointerEvents = originalStyles.pointerEvents;
      el.style.outline = originalStyles.outline;
      el.style.opacity = originalStyles.opacity;
      el.style.boxShadow = originalStyles.boxShadow;
      el.style.maxWidth = originalStyles.maxWidth;
    }

    function finalizePinnedElement(el) {
      const currentRect = el.getBoundingClientRect();
      const currentLayer = getCurrentDragLayer(el);
      clearDraggedPreviewStyles(el);
      el.style.position = "fixed";
      el.style.left = `${currentRect.left}px`;
      el.style.top = `${currentRect.top}px`;
      el.style.width = `${currentRect.width}px`;
      el.style.height = `${currentRect.height}px`;
      el.style.margin = "0";
      el.style.zIndex = `${dragLayerToZIndex(currentLayer)}`;
      el.style.boxSizing = "border-box";
      el.style.pointerEvents = "auto";

      if (state.drag.placeholder) {
        finalizePlaceholderAppearance(state.drag.placeholder);
      }

      state.drag.placeholderWasExisting = true;

      removeDragDropIndicator();
    }

    function finalizePlaceholderAppearance(placeholder) {
      if (!(placeholder instanceof HTMLElement)) {
        return;
      }

      placeholder.setAttribute("aria-hidden", "true");
      placeholder.style.border = "0";
      placeholder.style.background = "transparent";
      placeholder.style.boxShadow = "none";
      placeholder.style.pointerEvents = "none";
      placeholder.style.visibility = "hidden";
    }

    function positionDraggedPreview(clientX, clientY) {
      if (!state.drag.target) {
        return;
      }

      state.drag.target.style.left = `${clientX - state.drag.offsetX}px`;
      state.drag.target.style.top = `${clientY - state.drag.offsetY}px`;
      syncLiveDragLayerBadge(state.drag.target);
      positionLiveDragLayerBadge(clientX, clientY);
    }

    function resolveMovableBlock(element) {
      if (!(element instanceof Element) || isExtensionOwnedElement(element)) {
        return null;
      }

      const baseElement = resolveContextElement(element) || element;
      let current = baseElement;
      let fallback = null;
      let bestCandidate = null;
      let bestScore = -Infinity;
      let bestArea = Infinity;
      let depth = 0;

      while (current && current !== document.body && current !== document.documentElement && depth < 6) {
        if (isExtensionOwnedElement(current)) {
          current = current.parentElement;
          depth += 1;
          continue;
        }

        const rect = current.getBoundingClientRect();
        if (rect.width >= 8 && rect.height >= 8) {
          fallback ||= current;

          const area = rect.width * rect.height;
          const score = getMovableBlockScore(current, rect, depth);
          if (score > bestScore || (score === bestScore && area < bestArea)) {
            bestScore = score;
            bestCandidate = current;
            bestArea = area;
          }

          if (
            bestCandidate &&
            depth >= 2 &&
            bestScore >= 6 &&
            area > bestArea * 8
          ) {
            break;
          }
        }

        current = current.parentElement;
        depth += 1;
      }

      return bestCandidate || fallback;
    }

    function resolveDropLocation(clientX, clientY) {
      const stack = typeof document.elementsFromPoint === "function"
        ? document.elementsFromPoint(clientX, clientY)
        : [document.elementFromPoint(clientX, clientY)].filter(Boolean);

      const referenceElement = resolveDropReference(stack, state.drag.target);
      const container = referenceElement
        ? resolveDropContainer(referenceElement, state.drag.target)
        : null;

      if (container) {
        const directReference = projectReferenceIntoContainer(referenceElement, container);
        return {
          container,
          beforeNode: resolveBeforeNode(container, clientX, clientY, directReference)
        };
      }

      for (const entry of stack) {
        if (!(entry instanceof Element)) {
          continue;
        }

        const container = resolveDropContainer(entry, state.drag.target);
        if (!container) {
          continue;
        }

        return {
          container,
          beforeNode: resolveBeforeNode(container, clientX, clientY, null)
        };
      }

      return state.drag.placeholder?.parentElement
        ? {
            container: state.drag.placeholder.parentElement,
            beforeNode: state.drag.placeholder.nextElementSibling
          }
        : null;
    }

    function resolveDropContainer(element, draggedElement) {
      let current = element;
      let bestCandidate = null;
      let bestScore = -Infinity;
      let depth = 0;

      while (current) {
        if (isValidDropContainer(current, draggedElement)) {
          const score = getDropContainerScore(current, depth);
          if (score > bestScore) {
            bestScore = score;
            bestCandidate = current;
          }
        }

        if (current === document.body) {
          break;
        }

        current = current.parentElement;
        depth += 1;
      }

      return bestCandidate;
    }

    function resolveDropReference(stack, draggedElement) {
      for (const entry of stack) {
        if (!(entry instanceof HTMLElement)) {
          continue;
        }

        if (isExtensionOwnedElement(entry) || entry === draggedElement || draggedElement?.contains(entry)) {
          continue;
        }

        const rect = entry.getBoundingClientRect();
        if (rect.width < 2 || rect.height < 2) {
          continue;
        }

        return entry;
      }

      return null;
    }

    function projectReferenceIntoContainer(referenceElement, container) {
      if (!referenceElement || !container) {
        return null;
      }

      const blockChildren = collectStructuralContainerChildren(container);
      for (const child of blockChildren) {
        if (child === referenceElement || child.contains(referenceElement)) {
          return child;
        }
      }

      let current = referenceElement;
      while (current && current.parentElement && current.parentElement !== container) {
        current = current.parentElement;
      }

      return current?.parentElement === container ? current : null;
    }

    function collectStructuralContainerChildren(container) {
      if (!(container instanceof HTMLElement)) {
        return [];
      }

      return Array.from(container.children).filter((child) => {
        if (child === state.drag.target || child === state.drag.placeholder || isExtensionOwnedElement(child)) {
          return false;
        }

        const rect = child.getBoundingClientRect();
        if (rect.width < 8 || rect.height < 8) {
          return false;
        }

        const score = getMovableBlockScore(child, rect, 0);
        return score > -4;
      });
    }

    function isValidDropContainer(element, draggedElement) {
      if (!(element instanceof HTMLElement)) {
        return false;
      }

      if (!draggedElement) {
        return false;
      }

      if (isExtensionOwnedElement(element) || element === draggedElement || draggedElement.contains(element)) {
        return false;
      }

      const tag = element.tagName.toLowerCase();
      const role = element.getAttribute("role") || "";
      if (["script", "style", "noscript", "link", "meta", "head", "html", "img", "svg", "path", "canvas", "br"].includes(tag)) {
        return false;
      }

      if (DRAG_INTERACTIVE_CONTAINER_TAGS.has(tag) || DRAG_INTERACTIVE_CONTAINER_ROLES.has(role)) {
        return false;
      }

      return true;
    }

    function isStrongDropContainer(element) {
      const tag = element.tagName.toLowerCase();
      const role = element.getAttribute("role") || "";
      const styles = window.getComputedStyle(element);
      const display = styles.display;
      const rect = element.getBoundingClientRect();
      const blockChildren = collectStructuralContainerChildren(element);
      const hasMultipleDirectChildren = blockChildren.length >= 2;
      const hasLayoutDisplay = ["flex", "inline-flex", "grid", "inline-grid", "list-item", "flow-root"].includes(display);
      const isLargeEnough = rect.width >= 40 && rect.height >= 24;
      const looksLikeWrapper = blockChildren.length <= 1 && !String(element.textContent ?? "").trim();

      return (
        element === document.body ||
        DRAG_CONTAINER_TAGS.has(tag) ||
        DRAG_CONTAINER_ROLES.has(role) ||
        (hasLayoutDisplay && isLargeEnough) ||
        (hasMultipleDirectChildren && isLargeEnough && !looksLikeWrapper) ||
        ((tag === "div" || tag === "li") && hasMultipleDirectChildren && isLargeEnough)
      );
    }

    function resolveBeforeNode(container, clientX, clientY, preferredNode = null) {
      const blockChildren = collectStructuralContainerChildren(container);
      const candidates = blockChildren;

      if (candidates.length === 0) {
        return null;
      }

      const axis = getDropAxis(container);
      const layoutMode = getDropLayoutMode(container, candidates);
      const orderedCandidates = candidates
        .map((candidate) => ({
          candidate,
          rect: candidate.getBoundingClientRect()
        }))
        .filter(({ rect }) => rect.width >= 1 && rect.height >= 1)
        .sort((left, right) => {
          if (layoutMode === "grid") {
            const rowDiff = left.rect.top - right.rect.top;
            if (Math.abs(rowDiff) > 18) {
              return rowDiff;
            }

            return left.rect.left - right.rect.left;
          }

          const leftPosition = axis === "x" ? left.rect.left : left.rect.top;
          const rightPosition = axis === "x" ? right.rect.left : right.rect.top;
          return leftPosition - rightPosition;
        });

      if (orderedCandidates.length === 0) {
        return null;
      }

      if (preferredNode && candidates.includes(preferredNode)) {
        const rect = preferredNode.getBoundingClientRect();
        if (layoutMode === "grid") {
          const pointerBefore =
            clientY < rect.top + rect.height * 0.45 ||
            (clientY <= rect.bottom && clientX < rect.left + rect.width * 0.5);
          return pointerBefore
            ? preferredNode
            : getNextDroppableSibling(preferredNode, state.drag.target, state.drag.placeholder);
        }

        const midpoint = axis === "x" ? rect.left + rect.width * 0.5 : rect.top + rect.height * 0.5;
        const pointerValue = axis === "x" ? clientX : clientY;
        return pointerValue <= midpoint
          ? preferredNode
          : getNextDroppableSibling(preferredNode, state.drag.target, state.drag.placeholder);
      }

      if (layoutMode === "grid") {
        for (const { candidate, rect } of orderedCandidates) {
          if (clientY < rect.top + rect.height * 0.5) {
            if (clientY < rect.top || clientX <= rect.left + rect.width * 0.5) {
              return candidate;
            }
          }
        }

        const nearest = orderedCandidates
          .map(({ candidate, rect }) => ({
            candidate,
            distance: Math.hypot(clientX - (rect.left + rect.width * 0.5), clientY - (rect.top + rect.height * 0.5))
          }))
          .sort((left, right) => left.distance - right.distance)[0];

        if (nearest?.candidate) {
          const rect = nearest.candidate.getBoundingClientRect();
          return clientX <= rect.left + rect.width * 0.5
            ? nearest.candidate
            : getNextDroppableSibling(nearest.candidate, state.drag.target, state.drag.placeholder);
        }
      }

      const pointerValue = axis === "x" ? clientX : clientY;
      for (const { candidate, rect } of orderedCandidates) {
        const midpoint = axis === "x" ? rect.left + rect.width * 0.5 : rect.top + rect.height * 0.5;
        if (pointerValue <= midpoint) {
          return candidate;
        }
      }

      return null;
    }

    function getDragTargetScore(element, rect, depth = 0) {
      const tag = element.tagName.toLowerCase();
      const role = element.getAttribute("role") || "";
      const styles = window.getComputedStyle(element);
      const display = styles.display;
      const text = String(element.textContent ?? "").replace(/\s+/g, " ").trim();
      const ownText = Array.from(element.childNodes)
        .filter((node) => node.nodeType === Node.TEXT_NODE)
        .map((node) => String(node.textContent ?? "").trim())
        .join(" ")
        .trim();
      const siblingCount = element.parentElement ? element.parentElement.children.length : 0;
      const viewportArea = Math.max(window.innerWidth * window.innerHeight, 1);
      const areaRatio = (rect.width * rect.height) / viewportArea;
      const directChildren = element.childElementCount;
      const isVeryWide = rect.width > window.innerWidth * 0.58;
      const isVeryTall = rect.height > window.innerHeight * 0.42;

      let score = 0;
      if (DRAG_PREFERRED_TAGS.has(tag)) score += 5;
      if (DRAG_PREFERRED_ROLES.has(role)) score += 5;
      if (element.hasAttribute("href") || element.hasAttribute("aria-label")) score += 2;
      if (siblingCount > 1) score += 2;
      if (ownText) score += 3;
      if (text) score += 1;
      if (display !== "inline" && display !== "contents") score += 1;
      if (directChildren === 1 && !ownText && !DRAG_PREFERRED_TAGS.has(tag) && !DRAG_PREFERRED_ROLES.has(role)) score -= 3;
      if (directChildren >= 6) score -= 4;
      if (depth > 0) score -= depth * 1.4;
      if (areaRatio > 0.08) score -= 3;
      if (areaRatio > 0.18) score -= 7;
      if (isVeryWide) score -= 4;
      if (isVeryTall) score -= 4;
      if (tag === "div") score += 0.5;
      return score;
    }

    function getMovableBlockScore(element, rect, depth = 0) {
      const baseScore = getDragTargetScore(element, rect, depth);
      const parent = element.parentElement;
      let score = baseScore;

      if (parent && isValidDropContainer(parent, element)) {
        score += 3;
      }

      if (parent) {
        const parentTag = parent.tagName.toLowerCase();
        const parentRole = parent.getAttribute("role") || "";
        const parentDisplay = window.getComputedStyle(parent).display;
        const visibleSiblingCount = Array.from(parent.children).filter(
          (child) => !isExtensionOwnedElement(child)
        ).length;

        if (
          DRAG_CONTAINER_TAGS.has(parentTag) ||
          DRAG_CONTAINER_ROLES.has(parentRole) ||
          ["flex", "inline-flex", "grid", "inline-grid", "list-item", "flow-root", "block"].includes(parentDisplay) ||
          visibleSiblingCount >= 2
        ) {
          score += 6;
        }
      }

      if (element.childElementCount >= 10) {
        score -= 5;
      }

      return score;
    }

    function getDropContainerScore(element, depth = 0) {
      const tag = element.tagName.toLowerCase();
      const role = element.getAttribute("role") || "";
      const styles = window.getComputedStyle(element);
      const display = styles.display;
      const rect = element.getBoundingClientRect();
      const viewportArea = Math.max(window.innerWidth * window.innerHeight, 1);
      const areaRatio = (rect.width * rect.height) / viewportArea;
      const blockChildren = collectStructuralContainerChildren(element);

      let score = isStrongDropContainer(element) ? 6 : 0;
      if (DRAG_CONTAINER_TAGS.has(tag)) score += 3;
      if (DRAG_CONTAINER_ROLES.has(role)) score += 3;
      if (["flex", "inline-flex", "grid", "inline-grid", "list-item"].includes(display)) score += 3;
      if (blockChildren.length >= 2) score += 2;
      if (depth > 0) score -= depth * 1.2;
      if (areaRatio > 0.35) score -= 4;
      if (areaRatio > 0.6) score -= 6;
      if (element === document.body) score -= 2;
      return score;
    }

    function getDropLayoutMode(container, candidates) {
      const styles = window.getComputedStyle(container);
      if (styles.display === "grid" || styles.display === "inline-grid") {
        return "grid";
      }

      if ((styles.display === "flex" || styles.display === "inline-flex") && styles.flexDirection.startsWith("row")) {
        return "row";
      }

      const uniqueTops = new Set(
        candidates
          .map((candidate) => Math.round(candidate.getBoundingClientRect().top / 12) * 12)
          .filter(Number.isFinite)
      );
      const uniqueLefts = new Set(
        candidates
          .map((candidate) => Math.round(candidate.getBoundingClientRect().left / 12) * 12)
          .filter(Number.isFinite)
      );

      if (uniqueTops.size > 1 && uniqueLefts.size > 1) {
        return "grid";
      }

      return "column";
    }

    function getDropAxis(container) {
      const cs = window.getComputedStyle(container);
      if ((cs.display === "flex" || cs.display === "inline-flex") && cs.flexDirection.startsWith("row")) {
        return "x";
      }

      return "y";
    }

    function getNextDroppableSibling(node, draggedElement, placeholder) {
      let current = node?.nextElementSibling ?? null;
      while (current) {
        if (current !== draggedElement && current !== placeholder && !isExtensionOwnedElement(current)) {
          return current;
        }

        current = current.nextElementSibling;
      }

      return null;
    }

    function movePlaceholderToLocation({ container, beforeNode }) {
      if (!state.drag.placeholder || !container) {
        return;
      }

      const currentParent = state.drag.placeholder.parentElement;
      const currentBeforeNode = state.drag.placeholder.nextElementSibling;
      if (currentParent === container && currentBeforeNode === beforeNode) {
        renderDropIndicator(container, beforeNode);
        return;
      }

      container.insertBefore(state.drag.placeholder, beforeNode ?? null);
      state.drag.currentDropContainer = container;
      renderDropIndicator(container, beforeNode);
    }

    function saveDropRule(el, mode = "follow-page", explicitDragRule = null) {
      const selector = state.drag.sourceSelector || buildSelector(el);

      if (!selector) {
        return;
      }

      const dragRule =
        explicitDragRule ||
        (mode === "fixed-screen"
          ? buildPinNodeDragRule(selector, el)
          : buildPagePinNodeDragRule(selector, el));

      if (!dragRule) {
        setInlineStatus("这个位置暂时无法保存为跟随页面滚动，请改用固定在屏幕上。", "error");
        return;
      }

      void sendRuntimeMessage({
        type: "rules:save-drag",
        dragRule
      })
        .then(() => {
          setInlineStatus(
            mode === "fixed-screen"
              ? "这次拖拽已保存为固定在屏幕位置，刷新后也会保持悬浮。"
              : "这次拖拽已保存为跟随页面滚动，刷新后也会保持现在的排版位置。",
            "success"
          );
        })
        .catch(() => {});
    }

    function buildMoveNodeDragRule(selector) {
      const placeholder = state.drag.placeholder;
      const targetParent = placeholder?.parentElement;
      if (!(placeholder instanceof HTMLElement) || !(targetParent instanceof HTMLElement)) {
        return null;
      }

      const targetParentSelector = buildPersistableSelector(targetParent);
      if (!targetParentSelector) {
        return null;
      }

      const beforeNode = findNextStructuralSibling(placeholder, state.drag.target);
      return {
        type: "moveNode",
        selector,
        targetParentSelector,
        beforeSelector: beforeNode ? buildPersistableSelector(beforeNode) : ""
      };
    }

    function buildPagePinNodeDragRule(selector, element) {
      if (!selector || !(element instanceof HTMLElement)) {
        return null;
      }

      const rect = element.getBoundingClientRect();
      const layer = getCurrentDragLayer(element);
      return {
        type: "pagePinNode",
        selector,
        documentLeft: rect.left + window.scrollX,
        documentTop: rect.top + window.scrollY,
        width: rect.width,
        height: rect.height,
        zIndex: dragLayerToZIndex(layer)
      };
    }

    function buildPinNodeDragRule(selector, element) {
      if (!selector || !(element instanceof HTMLElement)) {
        return null;
      }

      const rect = element.getBoundingClientRect();
      const layer = getCurrentDragLayer(element);
      return {
        type: "pinNode",
        selector,
        left: rect.left,
        top: rect.top,
        width: rect.width,
        height: rect.height,
        zIndex: dragLayerToZIndex(layer)
      };
    }

    function normalizeDragLayer(value) {
      const parsed = Number.parseInt(value, 10);
      if (!Number.isFinite(parsed)) {
        return DRAG_LAYER_MAX;
      }

      return Math.min(DRAG_LAYER_MAX, Math.max(DRAG_LAYER_MIN, parsed));
    }

    function dragLayerToZIndex(layer) {
      return DRAG_LAYER_Z_INDEX_BASE + normalizeDragLayer(layer) - 1;
    }

    function zIndexToDragLayer(zIndex) {
      const parsed = Number.parseInt(zIndex, 10);
      if (!Number.isFinite(parsed)) {
        return DRAG_LAYER_MAX;
      }

      return normalizeDragLayer(parsed - DRAG_LAYER_Z_INDEX_BASE + 1);
    }

    function getCurrentDragLayer(element = null) {
      const pendingLayer =
        state.drag.pendingFollowDragRule?.zIndex ?? state.drag.pendingFixedDragRule?.zIndex ?? null;
      if (Number.isFinite(Number.parseInt(pendingLayer, 10))) {
        return zIndexToDragLayer(pendingLayer);
      }

      if (element instanceof HTMLElement) {
        return zIndexToDragLayer(element.style.zIndex || window.getComputedStyle(element).zIndex);
      }

      return DRAG_LAYER_MAX;
    }

    function setDragLayer(nextLayer) {
      const layer = normalizeDragLayer(nextLayer);
      const zIndex = dragLayerToZIndex(layer);
      if (state.drag.pendingFollowDragRule) {
        state.drag.pendingFollowDragRule.zIndex = zIndex;
      }
      if (state.drag.pendingFixedDragRule) {
        state.drag.pendingFixedDragRule.zIndex = zIndex;
      }

      const element = state.drag.target || state.drag.suppressClickTarget;
      if (element instanceof HTMLElement) {
        element.style.zIndex = `${zIndex}`;
      }

      syncLiveDragLayerBadge(element);
      syncDragLayerUi(element);
    }

    function syncDragLayerUi(element = null) {
      if (!state.drag.modeLayerValue || !state.drag.modeLayerHint) {
        return;
      }

      const layer = getCurrentDragLayer(element);
      state.drag.modeLayerValue.textContent = `第 ${layer} 层 / 共 ${DRAG_LAYER_MAX} 层`;
      state.drag.modeLayerHint.textContent =
        layer >= DRAG_LAYER_MAX
          ? "现在已经在最上层，最不容易被其他拖拽元素盖住。"
          : layer <= DRAG_LAYER_MIN
            ? "现在已经在最底层，更容易被上面的拖拽元素覆盖。"
            : "可以像一摞书一样继续往上或往下排，决定谁盖在最上面。";

      if (state.drag.modeBringFrontButton) {
        state.drag.modeBringFrontButton.disabled = layer >= DRAG_LAYER_MAX;
      }
      if (state.drag.modeLayerUpButton) {
        state.drag.modeLayerUpButton.disabled = layer >= DRAG_LAYER_MAX;
      }
      if (state.drag.modeLayerDownButton) {
        state.drag.modeLayerDownButton.disabled = layer <= DRAG_LAYER_MIN;
      }
      if (state.drag.modeSendBackButton) {
        state.drag.modeSendBackButton.disabled = layer <= DRAG_LAYER_MIN;
      }
    }

    function ensureLiveDragLayerBadge() {
      if (state.drag.liveLayerRoot) {
        return;
      }

      ensureInlineStyle();

      const root = document.createElement("div");
      root.className = "cwm-drag-live-layer";
      root.setAttribute(OWNED_ATTRIBUTE, "true");
      root.hidden = true;
      root.innerHTML = `
        <p class="cwm-drag-live-layer-label">实时层级</p>
        <p class="cwm-drag-live-layer-value">第 9 层 / 共 9 层</p>
        <p class="cwm-drag-live-layer-hint">滚轮切层，左中右括号也能调上下层。</p>
      `;

      (document.body || document.documentElement).appendChild(root);
      state.drag.liveLayerRoot = root;
      state.drag.liveLayerValue = root.querySelector(".cwm-drag-live-layer-value");
      state.drag.liveLayerHint = root.querySelector(".cwm-drag-live-layer-hint");
    }

    function openLiveDragLayerBadge(element = null) {
      ensureLiveDragLayerBadge();
      if (!state.drag.liveLayerRoot) {
        return;
      }

      syncLiveDragLayerBadge(element);
      state.drag.liveLayerRoot.hidden = false;
    }

    function closeLiveDragLayerBadge() {
      if (state.drag.liveLayerRoot) {
        state.drag.liveLayerRoot.hidden = true;
      }
    }

    function syncLiveDragLayerBadge(element = null) {
      if (!state.drag.liveLayerValue || !state.drag.liveLayerHint) {
        return;
      }

      const layer = getCurrentDragLayer(element);
      state.drag.liveLayerValue.textContent = `第 ${layer} 层 / 共 ${DRAG_LAYER_MAX} 层`;
      state.drag.liveLayerHint.textContent =
        layer >= DRAG_LAYER_MAX
          ? "现在在最上层。滚轮向下或按 [ 可以往下排。"
          : layer <= DRAG_LAYER_MIN
            ? "现在在最底层。滚轮向上或按 ] 可以往上排。"
            : "滚轮或 [ ] 可实时调整上下层，不用先放下。";
    }

    function positionLiveDragLayerBadge(clientX, clientY) {
      if (!state.drag.liveLayerRoot || state.drag.liveLayerRoot.hidden) {
        return;
      }

      const margin = 12;
      const rect = state.drag.liveLayerRoot.getBoundingClientRect();
      const width = rect.width || 180;
      const height = rect.height || 72;
      const left = Math.min(
        Math.max(margin, clientX + 18),
        Math.max(margin, window.innerWidth - width - margin)
      );
      const top = Math.min(
        Math.max(margin, clientY - height - 14),
        Math.max(margin, window.innerHeight - height - margin)
      );

      state.drag.liveLayerRoot.style.left = `${left}px`;
      state.drag.liveLayerRoot.style.top = `${top}px`;
    }

    function buildPersistableSelector(element) {
      if (!(element instanceof Element)) {
        return "";
      }

      if (element === document.body) {
        return "body";
      }

      if (element === document.documentElement) {
        return "html";
      }

      return buildSelector(element);
    }

    function findNextStructuralSibling(startNode, draggedElement) {
      let current = startNode?.nextElementSibling ?? null;
      while (current) {
        if (
          current !== draggedElement &&
          !isExtensionOwnedElement(current) &&
          !(current instanceof HTMLElement && current.hasAttribute(PIN_PLACEHOLDER_ATTRIBUTE))
        ) {
          return current;
        }

        current = current.nextElementSibling;
      }

      return null;
    }

    function ensureDragSaveModeChooser() {
      if (state.drag.modeRoot) {
        return;
      }

      ensureInlineStyle();

      const root = document.createElement("div");
      root.id = DRAG_MODE_ROOT_ID;
      root.setAttribute(OWNED_ATTRIBUTE, "true");
      root.hidden = true;
      root.innerHTML = `
        <section class="cwm-drag-mode-panel" role="dialog" aria-label="选择拖拽保存方式">
          <p class="cwm-drag-mode-eyebrow">拖拽保存方式</p>
          <h3 class="cwm-drag-mode-title">要怎么固定这次拖拽？</h3>
          <p class="cwm-drag-mode-status">默认推荐：跟随页面滚动，更不容易遮挡后文。</p>
          <section class="cwm-drag-mode-layer">
            <div class="cwm-drag-mode-layer-header">
              <p class="cwm-drag-mode-layer-label">当前层级</p>
              <p class="cwm-drag-mode-layer-value">第 9 层 / 共 9 层</p>
            </div>
            <p class="cwm-drag-mode-layer-hint">像一摞书一样排序。层级越高，越不容易被后面的元素盖住。</p>
            <div class="cwm-drag-mode-layer-actions">
              <button type="button" class="cwm-drag-mode-layer-btn" data-layer-action="front">置顶</button>
              <button type="button" class="cwm-drag-mode-layer-btn" data-layer-action="up">上一层</button>
              <button type="button" class="cwm-drag-mode-layer-btn" data-layer-action="down">下一层</button>
              <button type="button" class="cwm-drag-mode-layer-btn" data-layer-action="back">置底</button>
            </div>
          </section>
          <div class="cwm-drag-mode-actions">
            <button type="button" class="cwm-drag-mode-primary">跟随页面滚动</button>
            <button type="button" class="cwm-drag-mode-secondary">固定在屏幕上</button>
            <button type="button" class="cwm-drag-mode-cancel">取消这次保存</button>
          </div>
        </section>
      `;

      (document.body || document.documentElement).appendChild(root);

      state.drag.modeRoot = root;
      state.drag.modePanel = root.querySelector(".cwm-drag-mode-panel");
      state.drag.modeStatus = root.querySelector(".cwm-drag-mode-status");
      state.drag.modeLayerValue = root.querySelector(".cwm-drag-mode-layer-value");
      state.drag.modeLayerHint = root.querySelector(".cwm-drag-mode-layer-hint");
      state.drag.modeFollowButton = root.querySelector(".cwm-drag-mode-primary");
      state.drag.modePinButton = root.querySelector(".cwm-drag-mode-secondary");
      state.drag.modeBringFrontButton = root.querySelector('[data-layer-action="front"]');
      state.drag.modeLayerUpButton = root.querySelector('[data-layer-action="up"]');
      state.drag.modeLayerDownButton = root.querySelector('[data-layer-action="down"]');
      state.drag.modeSendBackButton = root.querySelector('[data-layer-action="back"]');
      state.drag.modeCancelButton = root.querySelector(".cwm-drag-mode-cancel");

      state.drag.modeFollowButton.addEventListener("click", () => {
        commitDragSaveMode("follow-page");
      });
      state.drag.modePinButton.addEventListener("click", () => {
        commitDragSaveMode("fixed-screen");
      });
      state.drag.modeCancelButton.addEventListener("click", () => {
        cancelDragSaveMode();
      });
      state.drag.modeBringFrontButton.addEventListener("click", () => {
        setDragLayer(DRAG_LAYER_MAX);
      });
      state.drag.modeLayerUpButton.addEventListener("click", () => {
        setDragLayer(getCurrentDragLayer() + 1);
      });
      state.drag.modeLayerDownButton.addEventListener("click", () => {
        setDragLayer(getCurrentDragLayer() - 1);
      });
      state.drag.modeSendBackButton.addEventListener("click", () => {
        setDragLayer(DRAG_LAYER_MIN);
      });

      root.addEventListener("contextmenu", (event) => {
        event.stopPropagation();
      });
    }

    function openDragSaveModeChooser(el, x, y) {
      ensureDragSaveModeChooser();
      if (!state.drag.modeRoot || !state.drag.modePanel) {
        return;
      }

      const targetLabel = state.drag.sourceSelector || buildSelector(el) || "当前元素";
      state.drag.modeStatus.textContent = `默认推荐：跟随页面滚动。当前目标：${targetLabel}`;
      syncDragLayerUi(el);
      state.drag.modeRoot.hidden = false;
      positionDragSaveModeChooser(x, y);
    }

    function closeDragSaveModeChooser() {
      if (state.drag.modeRoot) {
        state.drag.modeRoot.hidden = true;
      }
    }

    function positionDragSaveModeChooser(x, y) {
      if (!state.drag.modeRoot || !state.drag.modePanel) {
        return;
      }

      const margin = 12;
      const panelRect = state.drag.modePanel.getBoundingClientRect();
      const panelWidth = panelRect.width || Math.min(340, window.innerWidth - 24);
      const panelHeight = panelRect.height || 180;
      const left = Math.min(
        Math.max(margin, x + 10),
        Math.max(margin, window.innerWidth - panelWidth - margin)
      );
      const top = Math.min(
        Math.max(margin, y + 14),
        Math.max(margin, window.innerHeight - panelHeight - margin)
      );

      state.drag.modeRoot.style.left = `${left}px`;
      state.drag.modeRoot.style.top = `${top}px`;
    }

    function commitDragSaveMode(mode) {
      const el = state.drag.target || state.drag.suppressClickTarget;
      if (!(el instanceof HTMLElement)) {
        finalizeDragSaveInteraction();
        closeDragSaveModeChooser();
        return;
      }

      if (mode === "follow-page") {
        const dragRule =
          state.drag.pendingFollowDragRule ||
          buildPagePinNodeDragRule(state.drag.sourceSelector || buildSelector(el), el);
        if (!dragRule) {
          setInlineStatus("这个位置暂时无法保存为跟随页面滚动，请改用固定在屏幕上。", "error");
          return;
        }

        normalizeElementForDocumentFlow(el, dragRule.selector);
        promotePinnedElementToViewportHost(el);
        applyPagePinnedElementStyles(el, dragRule);
        closeDragSaveModeChooser();
        saveDropRule(el, mode, dragRule);
        finalizeDragSaveInteraction();
        return;
      } else {
        finalizePinnedElement(el);
      }

      closeDragSaveModeChooser();
      saveDropRule(el, mode, state.drag.pendingFixedDragRule);
      finalizeDragSaveInteraction();
    }

    function cancelDragSaveMode() {
      const el = state.drag.target || state.drag.suppressClickTarget;
      if (el instanceof HTMLElement) {
        commitElementIntoPageFlow(el);
      }

      closeDragSaveModeChooser();
      finalizeDragSaveInteraction();
      setInlineStatus("已取消这次拖拽保存。", "info");
    }

    function finalizeDragSaveInteraction() {
      state.drag.target = null;
      state.drag.placeholder = null;
      state.drag.currentDropContainer = null;
      state.drag.parent = null;
      state.drag.insertRef = null;
      state.drag.insertBefore = true;
      state.drag.sourceSelector = "";
      state.drag.startedInViewportHost = false;
      state.drag.placeholderWasExisting = false;
      state.drag.originalStyles = null;
      state.drag.suppressClickTarget = null;
      state.drag.wasPinnedBeforeDrag = false;
      state.drag.pendingFollowDragRule = null;
      state.drag.pendingFixedDragRule = null;
    }

    function commitElementIntoPageFlow(el) {
      const placeholder = state.drag.placeholder;
      if (!(el instanceof HTMLElement) || !(placeholder instanceof HTMLElement) || !placeholder.parentElement) {
        return;
      }

      if (state.drag.wasPinnedBeforeDrag) {
        clearDraggedPreviewStyles(el);
        el.style.position = "";
        el.style.left = "";
        el.style.top = "";
        el.style.width = "";
        el.style.height = "";
        el.style.margin = "";
        el.style.zIndex = "";
        el.style.boxSizing = "";
        el.style.pointerEvents = "auto";
      } else {
        restoreDraggedElementState(el);
      }
      el.removeAttribute(PIN_SOURCE_ATTRIBUTE);
      placeholder.parentElement.insertBefore(el, placeholder);
      placeholder.remove();
      state.drag.placeholder = null;
      state.drag.placeholderWasExisting = false;
      state.drag.originalStyles = null;
      removeDragDropIndicator();
    }

    function removeDragDropIndicator() {
      const el = document.getElementById(DRAG_DROP_INDICATOR_ID);
      if (el) {
        el.remove();
      }
    }

    function renderDropIndicator(container, beforeNode) {
      let indicator = document.getElementById(DRAG_DROP_INDICATOR_ID);
      if (!indicator) {
        indicator = document.createElement("div");
        indicator.id = DRAG_DROP_INDICATOR_ID;
        indicator.setAttribute(OWNED_ATTRIBUTE, "true");
        document.body.appendChild(indicator);
      }

      const axis = getDropAxis(container);
      const containerRect = container.getBoundingClientRect();
      const targetRect = beforeNode?.getBoundingClientRect?.() ?? null;

      indicator.style.position = "fixed";
      indicator.style.zIndex = "2147483645";
      indicator.style.pointerEvents = "none";
      indicator.style.background = "#1677ff";
      indicator.style.borderRadius = "999px";
      indicator.style.boxShadow = "0 0 0 1px rgba(255,255,255,0.9)";

      if (axis === "x") {
        const x = targetRect ? targetRect.left : containerRect.right;
        indicator.style.left = `${x - 1}px`;
        indicator.style.top = `${(targetRect ?? containerRect).top}px`;
        indicator.style.width = "3px";
        indicator.style.height = `${Math.max(18, (targetRect ?? containerRect).height)}px`;
      } else {
        const y = targetRect ? targetRect.top : containerRect.bottom;
        indicator.style.left = `${(targetRect ?? containerRect).left}px`;
        indicator.style.top = `${y - 1}px`;
        indicator.style.width = `${Math.max(24, (targetRect ?? containerRect).width)}px`;
        indicator.style.height = "3px";
      }
    }

    function updateInlineTargetSummary() {
      if (!state.inline.root || !state.lastContextTarget) {
        return;
      }

      const titleParts = [
        state.lastContextTarget.selectedText,
        state.lastContextTarget.text,
        state.lastContextTarget.tagName ? `<${state.lastContextTarget.tagName}>` : "",
        state.lastContextTarget.selector
      ]
        .filter(Boolean)
        .map((value) => String(value).trim())
        .filter(Boolean);

      state.inline.title.textContent = titleParts[0] || "当前右键目标";

      const metaParts = [
        state.lastContextTarget.selector,
        state.lastContextTarget.href,
        state.lastContextTarget.src
      ]
        .filter(Boolean)
        .join(" | ");

      state.inline.meta.textContent = metaParts || "将优先针对当前元素生成修改规则。";
    }

    function positionInlineEditor(x, y) {
      if (!state.inline.root || !state.inline.panel) {
        return;
      }

      const margin = 12;
      const anchorOffset = 18;
      const safeX = Number.isFinite(x) ? x : Math.round(window.innerWidth * 0.5);
      const safeY = Number.isFinite(y) ? y : 72;
      const panelRect = state.inline.panel.getBoundingClientRect();
      const panelWidth = panelRect.width || Math.min(420, Math.max(300, window.innerWidth - 24));
      const panelHeight =
        panelRect.height || Math.min(window.innerHeight - margin * 2, 680);
      const availableBelow = window.innerHeight - safeY - anchorOffset - margin;
      const availableAbove = safeY - anchorOffset - margin;
      const placeAbove = availableBelow < panelHeight && availableAbove > availableBelow;
      const left = Math.min(
        Math.max(margin, safeX + 10),
        Math.max(margin, window.innerWidth - panelWidth - margin)
      );
      const unclampedTop = placeAbove
        ? safeY - panelHeight - anchorOffset
        : safeY + anchorOffset;
      const top = Math.min(
        Math.max(margin, unclampedTop),
        Math.max(margin, window.innerHeight - panelHeight - margin)
      );

      state.inline.root.style.left = `${left}px`;
      state.inline.root.style.top = `${top}px`;
      state.inline.root.dataset.placement = placeAbove ? "top" : "bottom";
    }

    function updatePickerTarget(element, pointerX, pointerY) {
      if (!state.picker.active || !state.picker.box || !state.picker.badge) {
        return;
      }

      if (!(element instanceof Element) || isExtensionOwnedElement(element)) {
        return;
      }

      const rect = element.getBoundingClientRect();
      if (rect.width < 4 || rect.height < 4) {
        return;
      }

      state.picker.currentElement = element;
      state.picker.box.hidden = false;
      state.picker.box.style.left = `${Math.max(4, rect.left)}px`;
      state.picker.box.style.top = `${Math.max(4, rect.top)}px`;
      state.picker.box.style.width = `${Math.max(8, rect.width)}px`;
      state.picker.box.style.height = `${Math.max(8, rect.height)}px`;
      state.picker.badge.textContent = buildPickerBadgeText(element);
      positionPickerBadge(pointerX, pointerY, rect);
    }

    function positionPickerBadge(pointerX, pointerY, rect) {
      if (!state.picker.badge) {
        return;
      }

      const margin = 12;
      const badgeRect = state.picker.badge.getBoundingClientRect();
      const preferredLeft = Math.min(
        Math.max(margin, Number.isFinite(pointerX) ? pointerX + 12 : rect.left),
        Math.max(margin, window.innerWidth - badgeRect.width - margin)
      );
      const preferredTop = rect.top - badgeRect.height - 10 >= margin
        ? rect.top - badgeRect.height - 10
        : Math.min(window.innerHeight - badgeRect.height - margin, rect.bottom + 10);

      state.picker.badge.style.left = `${preferredLeft}px`;
      state.picker.badge.style.top = `${Math.max(margin, preferredTop)}px`;
    }

    function buildPickerBadgeText(element) {
      const selector = buildSelector(element);
      const text = getElementText(element).slice(0, 40);
      const label = text || selector || `<${String(element.tagName ?? "").toLowerCase()}>`;

      return `圈选模式：${label} | 单击选中 | 按住拖动画圈 | Esc 取消`;
    }

    function setInlineBusy(nextBusy) {
      state.inline.busy = nextBusy;
      syncInlineButtons();
    }

    function syncInlineButtons() {
      if (!state.inline.root) {
        return;
      }

      state.inline.previewButton.disabled = state.inline.busy;
      state.inline.saveButton.disabled = state.inline.busy || !state.inline.generatedRuleSet;
      if (state.inline.themeSelect) {
        state.inline.themeSelect.disabled = state.inline.busy;
      }
      if (state.inline.themePreviewButton) {
        state.inline.themePreviewButton.disabled = state.inline.busy;
      }
      if (state.inline.themeSaveButton) {
        state.inline.themeSaveButton.disabled = state.inline.busy;
      }
      if (state.inline.componentSelect) {
        state.inline.componentSelect.disabled = state.inline.busy;
      }
      if (state.inline.componentSearchInput) {
        state.inline.componentSearchInput.disabled = state.inline.busy;
      }
      if (state.inline.componentCategorySelect) {
        state.inline.componentCategorySelect.disabled = state.inline.busy;
      }
      if (state.inline.componentScopeSelect) {
        state.inline.componentScopeSelect.disabled = state.inline.busy;
      }
      if (state.inline.componentMotionModeSelect) {
        state.inline.componentMotionModeSelect.disabled = state.inline.busy;
      }
      if (state.inline.componentMotionSelect) {
        state.inline.componentMotionSelect.disabled = state.inline.busy;
      }
      if (state.inline.componentPreviewButton) {
        state.inline.componentPreviewButton.disabled = state.inline.busy;
      }
      if (state.inline.componentSaveButton) {
        state.inline.componentSaveButton.disabled = state.inline.busy;
      }
      state.inline.pickButton.disabled = state.inline.busy;
      if (state.inline.settingsButton) {
        state.inline.settingsButton.disabled = state.inline.busy;
      }
      state.inline.clearButton.disabled = state.inline.busy;
      state.inline.closeButton.disabled = state.inline.busy;
      if (state.inline.pageThemeButton) {
        state.inline.pageThemeButton.disabled = state.inline.busy;
      }
      if (state.inline.dragToggleButton) {
        state.inline.dragToggleButton.textContent = state.drag.active ? "关闭拖拽" : "开启拖拽";
      }
      applyInlineComponentMotionModeUi();
    }

    function setInlineStatus(message, tone = "") {
      if (!state.inline.status) {
        return;
      }

      state.inline.status.textContent = String(message ?? "").trim();
      state.inline.status.dataset.tone = tone;
    }

    function handlePickerPointerDown(event) {
      if (event.button !== 0) {
        return;
      }

      const targetElement = resolveContextElement(event.target) || state.picker.currentElement;
      if (!targetElement) {
        return;
      }

      event.preventDefault();
      event.stopPropagation();
      beginPickerDraw(targetElement, event.clientX, event.clientY);
    }

    function handlePickerPointerUp(event) {
      if (event.button !== 0 || !state.picker.isDrawing) {
        return;
      }

      event.preventDefault();
      event.stopPropagation();

      const fallbackElement =
        resolveContextElement(event.target) ||
        state.picker.currentElement ||
        state.picker.pointerDownElement;
      const resolvedSelection = state.picker.hasDragged
        ? resolveLassoSelection(state.picker.points, fallbackElement)
        : {
            element: fallbackElement,
            x: event.clientX,
            y: event.clientY
          };

      stopPickerMode({
        reopenInline: state.picker.reopenInlineAfterPick,
        targetElement: resolvedSelection?.element || fallbackElement,
        x: resolvedSelection?.x ?? event.clientX,
        y: resolvedSelection?.y ?? event.clientY
      });
    }

    function beginPickerDraw(targetElement, x, y) {
      const point = clampPickerPoint({ x, y });
      state.picker.isDrawing = true;
      state.picker.hasDragged = false;
      state.picker.pointerDownElement = targetElement;
      state.picker.currentElement = targetElement;
      state.picker.points = [point];
      state.picker.bounds = buildPointBounds(state.picker.points);
      state.picker.lastPointer = point;
      renderPickerLasso(false);
      updatePickerTarget(targetElement, point.x, point.y);
      updatePickerBadgeForDraw(point.x, point.y, false);
    }

    function updatePickerDrawing(event) {
      const targetElement = resolveContextElement(event.target);
      const point = clampPickerPoint({ x: event.clientX, y: event.clientY });

      state.picker.lastPointer = point;
      appendPickerPoint(point);

      if (!state.picker.hasDragged) {
        if (targetElement) {
          updatePickerTarget(targetElement, point.x, point.y);
        }
        updatePickerBadgeForDraw(point.x, point.y, false);
        return;
      }

      if (targetElement) {
        state.picker.currentElement = targetElement;
      }

      renderPickerLasso(false);
      updatePickerBadgeForDraw(point.x, point.y, true);
    }

    function appendPickerPoint(point) {
      const safePoint = clampPickerPoint(point);
      const lastPoint = state.picker.points[state.picker.points.length - 1];
      if (
        lastPoint &&
        calculatePointDistance(lastPoint, safePoint) < PICKER_POINT_MIN_DISTANCE_PX
      ) {
        return;
      }

      if (
        !state.picker.hasDragged &&
        state.picker.points.length > 0 &&
        calculatePointDistance(state.picker.points[0], safePoint) >= PICKER_DRAG_THRESHOLD_PX
      ) {
        state.picker.hasDragged = true;
        state.picker.box.hidden = true;
      }

      state.picker.points.push(safePoint);
      if (state.picker.points.length > PICKER_MAX_PATH_POINTS) {
        state.picker.points.shift();
      }
      state.picker.bounds = buildPointBounds(state.picker.points);
    }

    function renderPickerLasso(closePath = false) {
      if (!state.picker.lassoSvg || !state.picker.lassoPath) {
        return;
      }

      state.picker.lassoSvg.setAttribute(
        "viewBox",
        `0 0 ${window.innerWidth} ${window.innerHeight}`
      );

      if (!state.picker.isDrawing || state.picker.points.length < 2) {
        state.picker.lassoSvg.hidden = true;
        state.picker.lassoPath.setAttribute("d", "");
        return;
      }

      state.picker.lassoSvg.hidden = false;
      state.picker.lassoPath.setAttribute(
        "d",
        buildPickerPathData(state.picker.points, closePath)
      );
    }

    function buildPickerPathData(points, closePath) {
      if (!Array.isArray(points) || points.length === 0) {
        return "";
      }

      const commands = [`M ${Math.round(points[0].x)} ${Math.round(points[0].y)}`];
      for (let index = 1; index < points.length; index += 1) {
        commands.push(`L ${Math.round(points[index].x)} ${Math.round(points[index].y)}`);
      }

      if (closePath && points.length > 2) {
        commands.push("Z");
      }

      return commands.join(" ");
    }

    function updatePickerBadgeForDraw(pointerX, pointerY, isDraggingRegion) {
      if (!state.picker.badge) {
        return;
      }

      state.picker.badge.textContent = isDraggingRegion
        ? "自由圈选中：继续勾勒范围，松开后锁定这块区域 | Esc 取消"
        : "圈选模式：直接松开可选当前元素，按住拖动可自由画圈 | Esc 取消";

      const bounds = state.picker.bounds || {
        left: pointerX,
        top: pointerY,
        right: pointerX,
        bottom: pointerY
      };
      positionPickerBadge(pointerX, pointerY, bounds);
    }

    function resetPickerDrawState() {
      state.picker.isDrawing = false;
      state.picker.hasDragged = false;
      state.picker.pointerDownElement = null;
      state.picker.points = [];
      state.picker.bounds = null;
      state.picker.lastPointer = null;

      if (state.picker.box) {
        state.picker.box.hidden = false;
      }

      if (state.picker.lassoSvg) {
        state.picker.lassoSvg.hidden = true;
      }

      if (state.picker.lassoPath) {
        state.picker.lassoPath.setAttribute("d", "");
      }
    }

    function resolveLassoSelection(points, fallbackElement) {
      const polygon = Array.isArray(points) ? points.filter(isFinitePickerPoint) : [];
      const bounds = buildPointBounds(polygon);

      if (!bounds || polygon.length < 2) {
        return {
          element: fallbackElement,
          x: state.picker.lastPointer?.x ?? window.innerWidth * 0.5,
          y: state.picker.lastPointer?.y ?? 96
        };
      }

      const polygonArea = Math.max(calculatePolygonArea(polygon), 1);
      const centroid = calculatePolygonCentroid(polygon, bounds);
      const samplePoints = buildLassoSamplePoints(polygon, bounds);
      const candidateScores = new Map();
      const centroidElement = resolveElementAtLassoCentroid(centroid);

      if (centroidElement) {
        addLassoCandidate(candidateScores, centroidElement, polygonArea, centroid, {
          centroidBonus: true
        });
      }

      for (const point of samplePoints) {
        const stack = document.elementsFromPoint(point.x, point.y);
        const element = pickPreferredLassoTargetFromStack(stack, polygonArea, centroidElement);
        if (element) {
          addLassoCandidate(candidateScores, element, polygonArea, centroid);
        }
      }

      const bestElement =
        pickBestLassoCandidate(candidateScores, polygonArea) ||
        centroidElement ||
        fallbackElement;

      return {
        element: bestElement,
        x: centroid.x,
        y: centroid.y
      };
    }

    function buildLassoSamplePoints(polygon, bounds) {
      const samples = [...polygon];
      const stepX = Math.max(PICKER_SAMPLE_GRID_STEP_PX, Math.round(bounds.width / 6) || 0);
      const stepY = Math.max(PICKER_SAMPLE_GRID_STEP_PX, Math.round(bounds.height / 6) || 0);

      for (let y = bounds.top; y <= bounds.bottom; y += stepY) {
        for (let x = bounds.left; x <= bounds.right; x += stepX) {
          const point = clampPickerPoint({ x, y });
          if (pointInPolygon(point, polygon)) {
            samples.push(point);
          }
        }
      }

      samples.push(calculatePolygonCentroid(polygon, bounds));

      const unique = new Map();
      for (const point of samples) {
        unique.set(`${Math.round(point.x)}:${Math.round(point.y)}`, point);
      }

      return [...unique.values()];
    }

    function pickPreferredLassoTargetFromStack(stack, polygonArea, centroidElement = null) {
      const candidates = new Map();

      for (const rawElement of stack) {
        const element = resolveContextElement(rawElement);
        if (!(element instanceof Element) || isExtensionOwnedElement(element)) {
          continue;
        }

        const rect = element.getBoundingClientRect();
        if (rect.width < 6 || rect.height < 6) {
          continue;
        }

        candidates.set(
          element,
          getLassoTargetPriority(element, polygonArea, {
            centroidElement
          })
        );
      }

      if (candidates.size === 0) {
        return null;
      }

      const rankedCandidates = [...candidates.entries()].sort((left, right) => right[1] - left[1]);
      const meaningfulCandidate = rankedCandidates.find(([element]) =>
        isMeaningfulLassoTarget(element)
      );

      return meaningfulCandidate?.[0] ?? rankedCandidates[0][0];
    }

    function addLassoCandidate(
      candidateScores,
      element,
      polygonArea,
      centroid,
      { centroidBonus = false } = {}
    ) {
      if (!(element instanceof Element) || isExtensionOwnedElement(element)) {
        return;
      }

      const rect = element.getBoundingClientRect();
      if (rect.width < 6 || rect.height < 6) {
        return;
      }

      const area = rect.width * rect.height;
      const areaRatio = area / polygonArea;
      const containsCentroid =
        rect.left <= centroid.x &&
        rect.top <= centroid.y &&
        rect.right >= centroid.x &&
        rect.bottom >= centroid.y;
      const previous =
        candidateScores.get(element) ?? {
          score: 0,
          hits: 0,
          area
        };

      let scoreDelta = getLassoTargetPriority(element, polygonArea);
      if (containsCentroid) {
        scoreDelta += 5;
      }
      if (centroidBonus) {
        scoreDelta += 14;
      }
      if (areaRatio >= 0.08 && areaRatio <= 10) {
        scoreDelta += 6;
      } else if (areaRatio > 16) {
        scoreDelta -= 12;
      }
      scoreDelta += Math.min(previous.hits, 4);

      candidateScores.set(element, {
        score: previous.score + scoreDelta,
        hits: previous.hits + 1,
        area
      });
    }

    function pickBestLassoCandidate(candidateScores, polygonArea) {
      const candidates = [...candidateScores.entries()]
        .filter(([element, entry]) => {
          if (!(element instanceof Element)) {
            return false;
          }

          if (entry.score <= 0) {
            return false;
          }

          const tagName = String(element.tagName ?? "").toLowerCase();
          return tagName !== "html";
        })
        .sort((left, right) => {
          const scoreDelta = right[1].score - left[1].score;
          if (scoreDelta !== 0) {
            return scoreDelta;
          }

          const leftAreaDelta = Math.abs((left[1].area ?? polygonArea) - polygonArea);
          const rightAreaDelta = Math.abs((right[1].area ?? polygonArea) - polygonArea);
          return leftAreaDelta - rightAreaDelta;
        });

      return candidates[0]?.[0] ?? null;
    }

    function getLassoTargetPriority(element, polygonArea, { centroidElement = null } = {}) {
      const tagName = String(element.tagName ?? "").toLowerCase();
      const rect = element.getBoundingClientRect();
      const area = Math.max(rect.width * rect.height, 1);
      const areaRatio = area / Math.max(polygonArea, 1);
      const text = getElementText(element).trim();

      let priority = 0;
      if (element === centroidElement) {
        priority += 10;
      }
      if (isMeaningfulLassoTarget(element)) {
        priority += 10;
      }
      if (text) {
        priority += Math.min(8, Math.ceil(text.length / 18));
      }
      if (tagName === "button" || tagName === "a") {
        priority += 8;
      } else if (
        /^(h1|h2|h3|h4|h5|h6|p|li|span|label|img|figure|input|textarea|select)$/i.test(
          tagName
        )
      ) {
        priority += 6;
      } else if (/^(div|section|article|main|aside|nav)$/i.test(tagName)) {
        priority -= 6;
      }

      if (element.getAttribute("role") === "button") {
        priority += 4;
      }

      if (areaRatio > 18) {
        priority -= 12;
      } else if (areaRatio < 0.03) {
        priority -= 4;
      }

      return priority;
    }

    function isMeaningfulLassoTarget(element) {
      if (!(element instanceof Element)) {
        return false;
      }

      const tagName = String(element.tagName ?? "").toLowerCase();
      if (/^(button|a|label|input|textarea|select|img|figure|h1|h2|h3|h4|h5|h6|p|li)$/i.test(tagName)) {
        return true;
      }

      if (element.getAttribute("role") && element.getAttribute("role") !== "presentation") {
        return true;
      }

      if (
        element.getAttribute("aria-label") ||
        element.getAttribute("placeholder") ||
        element.getAttribute("alt")
      ) {
        return true;
      }

      return Boolean(getElementText(element).trim());
    }

    function resolveElementAtLassoCentroid(centroid) {
      const elements = document.elementsFromPoint(centroid.x, centroid.y);

      for (const rawElement of elements) {
        const element = resolveContextElement(rawElement);
        if (element && !isExtensionOwnedElement(element)) {
          return element;
        }
      }

      return null;
    }

    function calculatePolygonArea(points) {
      if (!Array.isArray(points) || points.length < 3) {
        return 0;
      }

      let twiceArea = 0;
      for (let index = 0; index < points.length; index += 1) {
        const current = points[index];
        const next = points[(index + 1) % points.length];
        twiceArea += current.x * next.y - next.x * current.y;
      }

      return Math.abs(twiceArea) * 0.5;
    }

    function calculatePolygonCentroid(points, bounds) {
      if (!Array.isArray(points) || points.length === 0) {
        return clampPickerPoint({
          x: bounds?.left ?? window.innerWidth * 0.5,
          y: bounds?.top ?? 96
        });
      }

      let signedTwiceArea = 0;
      for (let index = 0; index < points.length; index += 1) {
        const current = points[index];
        const next = points[(index + 1) % points.length];
        signedTwiceArea += current.x * next.y - next.x * current.y;
      }

      if (!signedTwiceArea) {
        const average = points.reduce(
          (accumulator, point) => ({
            x: accumulator.x + point.x,
            y: accumulator.y + point.y
          }),
          { x: 0, y: 0 }
        );
        return clampPickerPoint({
          x: average.x / points.length,
          y: average.y / points.length
        });
      }

      let centroidX = 0;
      let centroidY = 0;
      for (let index = 0; index < points.length; index += 1) {
        const current = points[index];
        const next = points[(index + 1) % points.length];
        const cross = current.x * next.y - next.x * current.y;
        centroidX += (current.x + next.x) * cross;
        centroidY += (current.y + next.y) * cross;
      }

      return clampPickerPoint({
        x: centroidX / (3 * signedTwiceArea),
        y: centroidY / (3 * signedTwiceArea)
      });
    }

    function buildPointBounds(points) {
      if (!Array.isArray(points) || points.length === 0) {
        return null;
      }

      const xs = points.map((point) => point.x);
      const ys = points.map((point) => point.y);
      const left = Math.max(0, Math.min(...xs));
      const top = Math.max(0, Math.min(...ys));
      const right = Math.min(window.innerWidth, Math.max(...xs));
      const bottom = Math.min(window.innerHeight, Math.max(...ys));

      return {
        left,
        top,
        right,
        bottom,
        width: Math.max(1, right - left),
        height: Math.max(1, bottom - top)
      };
    }

    function clampPickerPoint(point) {
      return {
        x: Math.min(Math.max(Number(point?.x ?? 0), 4), Math.max(4, window.innerWidth - 4)),
        y: Math.min(Math.max(Number(point?.y ?? 0), 4), Math.max(4, window.innerHeight - 4))
      };
    }

    function isFinitePickerPoint(point) {
      return Number.isFinite(point?.x) && Number.isFinite(point?.y);
    }

    function calculatePointDistance(left, right) {
      return Math.hypot(
        Number(right.x ?? 0) - Number(left.x ?? 0),
        Number(right.y ?? 0) - Number(left.y ?? 0)
      );
    }

    function pointInPolygon(point, polygon) {
      if (!Array.isArray(polygon) || polygon.length < 3) {
        return false;
      }

      let inside = false;
      for (
        let index = 0, previousIndex = polygon.length - 1;
        index < polygon.length;
        previousIndex = index, index += 1
      ) {
        const current = polygon[index];
        const previous = polygon[previousIndex];
        const intersects =
          current.y > point.y !== previous.y > point.y &&
          point.x <
            ((previous.x - current.x) * (point.y - current.y)) /
              ((previous.y - current.y) || Number.EPSILON) +
              current.x;
        if (intersects) {
          inside = !inside;
        }
      }

      return inside;
    }

    function resolveContextElement(node) {
      const element =
        node instanceof Element
          ? node
          : node && node.parentElement instanceof Element
            ? node.parentElement
            : null;

      if (!element) {
        return document.body;
      }

      if (state.inline.root && element.closest(`#${INLINE_ROOT_ID}`)) {
        return null;
      }

      // 优先：当前元素本身就是精确交互元素，直接返回
      const PRECISE_TAGS = new Set(["button", "a", "input", "textarea", "select", "label", "option", "img", "video", "audio", "svg", "canvas"]);
      const PRECISE_ROLES = new Set(["button", "tab", "menuitem", "option", "link", "checkbox", "radio", "switch", "treeitem"]);
      const tagName = element.tagName.toLowerCase();
      const role = element.getAttribute("role") || "";
      if (PRECISE_TAGS.has(tagName) || PRECISE_ROLES.has(role)) {
        if (tagName === "select" && element instanceof HTMLSelectElement) {
          return element.selectedOptions?.[0] || element;
        }
        return element;
      }

      // 次优先：向上找精确交互元素（但不超过 4 层，防止选中整个 nav）
      let cur = element.parentElement;
      let depth = 0;
      while (cur && depth < 4) {
        const ct = cur.tagName.toLowerCase();
        const cr = cur.getAttribute("role") || "";
        if (PRECISE_TAGS.has(ct) || PRECISE_ROLES.has(cr)) {
          if (ct === "select" && cur instanceof HTMLSelectElement) {
            return cur.selectedOptions?.[0] || cur;
          }
          return cur;
        }
        // 遇到布局容器停止向上
        if (["nav", "ul", "ol", "menu", "section", "article", "main", "aside", "header", "footer", "form"].includes(ct)) {
          break;
        }
        cur = cur.parentElement;
        depth++;
      }

      // 兜底：当前元素本身
      return element.closest(
        "h1, h2, h3, h4, h5, h6, p, li, span, td, th, dt, dd, figcaption, blockquote, div, section, article, main, aside, nav"
      ) || element;
    }

    function getSelectedTextForElement(element) {
      if (!(element instanceof Element)) {
        return "";
      }

      const tagName = String(element.tagName ?? "").toLowerCase();
      if (tagName === "option") {
        return String(element.textContent ?? "").trim();
      }

      if (tagName === "select" && element instanceof HTMLSelectElement) {
        const option = element.selectedOptions?.[0] || null;
        return String(option?.textContent ?? option?.label ?? element.value ?? "").trim();
      }

      if (element instanceof HTMLInputElement || element instanceof HTMLTextAreaElement) {
        const source = String(element.value ?? "");
        const start = Number.isInteger(element.selectionStart) ? element.selectionStart : null;
        const end = Number.isInteger(element.selectionEnd) ? element.selectionEnd : null;
        if (start !== null && end !== null && end > start) {
          return source.slice(start, end).trim();
        }
      }

      const selection = window.getSelection?.();
      const selectionText = String(selection?.toString?.() ?? "").trim();
      if (!selectionText || !selection || selection.rangeCount === 0) {
        return "";
      }

      const intersectsTarget = Array.from({ length: selection.rangeCount }).some((_, index) => {
        const range = selection.getRangeAt(index);
        if (range.collapsed) {
          return false;
        }
        try {
          return range.intersectsNode(element);
        } catch {
          const ancestor = range.commonAncestorContainer;
          return element.contains(ancestor) || ancestor.contains?.(element);
        }
      });

      return intersectsTarget ? selectionText : "";
    }

    function captureTargetContext(element, { x, y }) {
      const text = getElementText(element);
      const selectedText = getSelectedTextForElement(element);
      const cs = window.getComputedStyle(element);

      return {
        element,
        selector: buildSelector(element),
        tagName: String(element.tagName ?? "").toLowerCase(),
        text,
        selectedText,
        role: element.getAttribute?.("role") || "",
        ariaLabel: element.getAttribute?.("aria-label") || "",
        ariaSelected: element.getAttribute?.("aria-selected") || "",
        ariaExpanded: element.getAttribute?.("aria-expanded") || "",
        ariaChecked: element.getAttribute?.("aria-checked") || "",
        dataTestId: element.getAttribute?.("data-testid") || "",
        placeholder: element.getAttribute?.("placeholder") || "",
        href: element.getAttribute?.("href") || "",
        src: element.getAttribute?.("src") || "",
        computedDisplay: cs.display || "",
        computedPosition: cs.position || "",
        isInsideList: Boolean(element.closest("ul, ol, menu")),
        isInsideNav: Boolean(element.closest("nav, [role='navigation'], [role='tablist'], [role='menubar']")),
        x,
        y
      };
    }

    function serializeTargetContext() {
      if (!state.lastContextTarget) {
        return null;
      }

      return {
        selector: String(state.lastContextTarget.selector ?? "").trim(),
        tagName: String(state.lastContextTarget.tagName ?? "").trim(),
        text: String(state.lastContextTarget.text ?? "").trim(),
        selectedText: String(state.lastContextTarget.selectedText ?? "").trim(),
        role: String(state.lastContextTarget.role ?? "").trim(),
        ariaLabel: String(state.lastContextTarget.ariaLabel ?? "").trim(),
        ariaSelected: String(state.lastContextTarget.ariaSelected ?? "").trim(),
        ariaExpanded: String(state.lastContextTarget.ariaExpanded ?? "").trim(),
        dataTestId: String(state.lastContextTarget.dataTestId ?? "").trim(),
        placeholder: String(state.lastContextTarget.placeholder ?? "").trim(),
        href: String(state.lastContextTarget.href ?? "").trim(),
        src: String(state.lastContextTarget.src ?? "").trim(),
        computedDisplay: String(state.lastContextTarget.computedDisplay ?? "").trim(),
        computedPosition: String(state.lastContextTarget.computedPosition ?? "").trim(),
        isInsideList: Boolean(state.lastContextTarget.isInsideList),
        isInsideNav: Boolean(state.lastContextTarget.isInsideNav),
        isPageTheme: Boolean(state.lastContextTarget.isPageTheme)
      };
    }

    function formatInlineError(error) {
      return error instanceof Error && error.message
        ? error.message
        : "扩展请求失败，请检查模型接口或刷新页面后重试。";
    }

    function normalizeInlineThemeSearchQuery(query) {
      return String(query ?? "").trim().toLowerCase();
    }

    function parseInlineHexColor(hex) {
      const raw = String(hex ?? "").trim().replace(/^#/, "");
      const normalized = raw.length === 3
        ? raw.split("").map((char) => char + char).join("")
        : raw;
      if (!/^[0-9a-fA-F]{6}$/.test(normalized)) {
        return null;
      }
      return {
        r: Number.parseInt(normalized.slice(0, 2), 16),
        g: Number.parseInt(normalized.slice(2, 4), 16),
        b: Number.parseInt(normalized.slice(4, 6), 16)
      };
    }

    function getInlineRelativeLuminance(rgb) {
      if (!rgb) {
        return 0;
      }
      const toLinear = (value) => {
        const srgb = value / 255;
        return srgb <= 0.04045
          ? srgb / 12.92
          : ((srgb + 0.055) / 1.055) ** 2.4;
      };
      const r = toLinear(rgb.r);
      const g = toLinear(rgb.g);
      const b = toLinear(rgb.b);
      return 0.2126 * r + 0.7152 * g + 0.0722 * b;
    }

    function getInlineThemeLightness(theme) {
      const bg = getInlineRelativeLuminance(parseInlineHexColor(theme?.colors?.bg));
      const card = getInlineRelativeLuminance(parseInlineHexColor(theme?.colors?.card));
      return bg * 0.7 + card * 0.3;
    }

    function getInlineThemeRgba(hex, alpha = 1) {
      const rgb = parseInlineHexColor(hex);
      if (!rgb) {
        return `rgba(255, 255, 255, ${alpha})`;
      }
      const normalizedAlpha = Math.max(0, Math.min(1, Number(alpha) || 0));
      return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${normalizedAlpha})`;
    }

    function getInlineThemeSortPriority(theme) {
      if (theme?.id === "soft_mist_blue_pink") {
        return -1;
      }
      return 0;
    }

    function isInlineLightTheme(theme) {
      return getInlineThemeLightness(theme) >= 0.62;
    }

    function normalizeInlineThemeToneFilter(value) {
      const normalized = String(value ?? "all").trim().toLowerCase();
      if (normalized === "light" || normalized === "dark") {
        return normalized;
      }
      return "all";
    }

    function isInlineDynamicTheme(theme) {
      return Boolean(String(theme?.dynamicBackground ?? "").trim());
    }

    function matchesInlineThemeTone(theme, tone) {
      if (tone === "all") {
        return true;
      }
      const light = isInlineLightTheme(theme);
      return tone === "light" ? light : !light;
    }

    function matchesInlineThemeKeyword(theme, keyword) {
      if (!keyword) {
        return true;
      }
      const name = String(theme?.name ?? "").toLowerCase();
      const id = String(theme?.id ?? "").toLowerCase();
      return name.includes(keyword) || id.includes(keyword);
    }

    function getVisibleInlineThemes() {
      const keyword = normalizeInlineThemeSearchQuery(state.inline.themeSearchInput?.value);
      const tone = normalizeInlineThemeToneFilter(state.inline.themeToneSelect?.value);
      return INLINE_THEME_TEMPLATES
        .filter((theme) => matchesInlineThemeKeyword(theme, keyword) && matchesInlineThemeTone(theme, tone))
        .slice()
        .sort((left, right) => {
          const priorityGap = getInlineThemeSortPriority(left) - getInlineThemeSortPriority(right);
          if (priorityGap !== 0) {
            return priorityGap;
          }
          const lightnessGap = getInlineThemeLightness(right) - getInlineThemeLightness(left);
          if (Math.abs(lightnessGap) > 0.0001) {
            return lightnessGap;
          }
          return String(left.name).localeCompare(String(right.name), "zh-Hans-CN");
        });
    }

    function renderInlineThemeTemplateOptions() {
      if (!state.inline.themeSelect) {
        return;
      }

      const previousSelectedId = String(state.inline.themeSelect.value ?? "").trim();
      const visibleThemes = getVisibleInlineThemes();
      state.inline.themeSelect.innerHTML = "";

      if (visibleThemes.length === 0) {
        const emptyOption = document.createElement("option");
        emptyOption.value = "";
        emptyOption.textContent = "未找到匹配模板";
        emptyOption.disabled = true;
        emptyOption.selected = true;
        state.inline.themeSelect.appendChild(emptyOption);
        return;
      }

      for (const theme of visibleThemes) {
        const option = document.createElement("option");
        option.value = theme.id;
        option.textContent = theme.name;
        state.inline.themeSelect.appendChild(option);
      }

      const selectedId = visibleThemes.some((theme) => theme.id === previousSelectedId)
        ? previousSelectedId
        : visibleThemes[0].id;
      state.inline.themeSelect.value = selectedId;
    }

    function getSelectedInlineThemeTemplate() {
      const selectedId = String(state.inline.themeSelect?.value ?? "").trim();
      return INLINE_THEME_TEMPLATES.find((theme) => theme.id === selectedId) ?? null;
    }

    function buildInlineThemeDynamicBackgroundCss(theme) {
      return "";
    }

    function buildInlineThemeTemplateRuleSet(theme) {
      const colors = theme.colors;
      const dynamicCss = "";
      const dynamicTheme = false;
      const shellBg = "var(--cwm-theme-card)";
      const shellBgSoft = "var(--cwm-theme-card)";
      const shellBorder = "var(--cwm-theme-border)";
      const tableBg = "var(--cwm-theme-card)";
      const css = `
/* cwm-theme-template */
:root {
  --cwm-theme-bg: ${colors.bg};
  --cwm-theme-bg-soft: ${colors.bgSoft};
  --cwm-theme-card: ${colors.card};
  --cwm-theme-text: ${colors.text};
  --cwm-theme-muted: ${colors.textMuted};
  --cwm-theme-accent: ${colors.accent};
  --cwm-theme-accent-strong: ${colors.accentStrong};
  --cwm-theme-border: ${colors.border};
  --cwm-theme-input: ${colors.input};
  --bgColor-default: var(--cwm-theme-bg-soft);
  --bgColor-muted: var(--cwm-theme-card);
  --fgColor-default: var(--cwm-theme-text);
  --fgColor-muted: var(--cwm-theme-muted);
  --borderColor-default: var(--cwm-theme-border);
  --button-default-bgColor-rest: var(--cwm-theme-accent);
  --button-default-borderColor-rest: var(--cwm-theme-accent-strong);
  --button-default-fgColor-rest: #ffffff;
}
html, body {
  background-color: ${dynamicTheme ? "transparent" : "var(--cwm-theme-bg)"} !important;
  color: var(--cwm-theme-text) !important;
}
main, section, article, aside, nav, header, footer, div,
[class*="bg"], [class*="background"], [class*="container"], [class*="wrapper"],
[class*="panel"], [class*="content"], [class*="layout"], [class*="module"],
[class*="box"], [class*="shell"], [class*="surface"], [class*="block"] {
  background-color: ${shellBg} !important;
  color: var(--cwm-theme-text) !important;
  border-color: ${shellBorder} !important;
  ${dynamicTheme ? "backdrop-filter: blur(16px) saturate(1.05) !important;" : ""}
  ${dynamicTheme ? "-webkit-backdrop-filter: blur(16px) saturate(1.05) !important;" : ""}
}
a, a:visited {
  color: var(--cwm-theme-accent-strong) !important;
}
button, [role="button"], .btn, [class*="button"], [class*="btn-"] {
  background: linear-gradient(130deg, var(--cwm-theme-accent), var(--cwm-theme-accent-strong)) !important;
  border-color: var(--cwm-theme-accent-strong) !important;
  color: #ffffff !important;
}
input, textarea, select, [role="textbox"], [contenteditable="true"] {
  background: var(--cwm-theme-input) !important;
  border-color: var(--cwm-theme-border) !important;
  color: var(--cwm-theme-text) !important;
}
small, p, span, label, .muted, [class*="muted"], [class*="secondary"], [class*="subtext"], [class*="placeholder"] {
  color: var(--cwm-theme-muted) !important;
}
.card, [class*="card"], [class*="panel"], [class*="container"], [class*="surface"], [class*="modal"], [class*="popover"], [class*="dropdown"], [class*="menu"] {
  background-color: ${shellBgSoft} !important;
  border-color: ${shellBorder} !important;
  color: var(--cwm-theme-text) !important;
  ${dynamicTheme ? "backdrop-filter: blur(18px) saturate(1.06) !important;" : ""}
  ${dynamicTheme ? "-webkit-backdrop-filter: blur(18px) saturate(1.06) !important;" : ""}
  ${dynamicTheme ? "box-shadow: 0 18px 48px rgba(15, 23, 42, 0.08) !important;" : ""}
}
table, thead, tbody, tr, th, td {
  background-color: ${tableBg} !important;
  border-color: ${shellBorder} !important;
  color: var(--cwm-theme-text) !important;
}
img, video, canvas, svg, picture, source, iframe {
  background: transparent !important;
}
[data-color-mode] {
  --bgColor-default: var(--cwm-theme-bg) !important;
  --bgColor-muted: var(--cwm-theme-bg-soft) !important;
  --fgColor-default: var(--cwm-theme-text) !important;
  --fgColor-muted: var(--cwm-theme-muted) !important;
  --borderColor-default: var(--cwm-theme-border) !important;
}
.color-bg-default, .color-bg-subtle, .color-bg-canvas, .color-bg-inset {
  background-color: ${shellBgSoft} !important;
}
.color-fg-default, .color-fg-muted {
  color: var(--cwm-theme-text) !important;
}
${dynamicCss}
@media (prefers-reduced-motion: reduce) {
  html, body, button, [role="button"], .btn, [class*="button"], [class*="btn-"] {
    animation: none !important;
  }
}
      `.trim();

      return {
        hostname: getSiteKey(),
        summary: `应用主题模板：${theme.name}`,
        rules: [
          {
            id: `inline-theme-template-${theme.id}`,
            type: "customCss",
            css,
            label: `Theme template: ${theme.name}`
          }
        ]
      };
    }

    function normalizeInlineComponentSearchQuery(query) {
      return String(query ?? "").trim().toLowerCase();
    }

    function normalizeInlineComponentCategoryFilter(value) {
      const normalized = String(value ?? "all").trim().toLowerCase();
      if (["all", "button", "input", "card", "badge", "select"].includes(normalized)) {
        return normalized;
      }
      return "all";
    }

    function matchesInlineComponentCategory(template, category) {
      if (category === "all") {
        return true;
      }
      return String(template?.category ?? "").toLowerCase() === category;
    }

    function matchesInlineComponentKeyword(template, keyword) {
      if (!keyword) {
        return true;
      }
      const name = String(template?.name ?? "").toLowerCase();
      const id = String(template?.id ?? "").toLowerCase();
      const category = String(template?.category ?? "").toLowerCase();
      const keywords = Array.isArray(template?.keywords)
        ? template.keywords.map((item) => String(item ?? "").toLowerCase()).join(" ")
        : "";
      return name.includes(keyword) || id.includes(keyword) || category.includes(keyword) || keywords.includes(keyword);
    }

    function getVisibleInlineComponents() {
      const keyword = normalizeInlineComponentSearchQuery(state.inline.componentSearchInput?.value);
      const category = normalizeInlineComponentCategoryFilter(state.inline.componentCategorySelect?.value);
      return INLINE_COMPONENT_TEMPLATES
        .filter((template) =>
          matchesInlineComponentKeyword(template, keyword) &&
          matchesInlineComponentCategory(template, category)
        )
        .slice()
        .sort((left, right) => String(left.name).localeCompare(String(right.name), "zh-Hans-CN"));
    }

    function renderInlineComponentTemplateOptions() {
      if (!state.inline.componentSelect) {
        return;
      }

      const previousSelectedId = String(state.inline.componentSelect.value ?? "").trim();
      const visibleComponents = getVisibleInlineComponents();
      state.inline.componentSelect.innerHTML = "";

      if (visibleComponents.length === 0) {
        const emptyOption = document.createElement("option");
        emptyOption.value = "";
        emptyOption.textContent = "未找到匹配组件";
        emptyOption.disabled = true;
        emptyOption.selected = true;
        state.inline.componentSelect.appendChild(emptyOption);
        return;
      }

      for (const component of visibleComponents) {
        const option = document.createElement("option");
        option.value = component.id;
        option.textContent = `${component.name}（${component.category}）`;
        state.inline.componentSelect.appendChild(option);
      }

      const selectedId = visibleComponents.some((component) => component.id === previousSelectedId)
        ? previousSelectedId
        : visibleComponents[0].id;
      state.inline.componentSelect.value = selectedId;
    }

    function getSelectedInlineComponentTemplate() {
      const selectedId = String(state.inline.componentSelect?.value ?? "").trim();
      return INLINE_COMPONENT_TEMPLATES.find((component) => component.id === selectedId) ?? null;
    }

    function buildInlineComponentTemplateRuleSet(componentTemplate, targetContext) {
      const scope = normalizeInlineComponentScope(state.inline.componentScopeSelect?.value);
      const motionPreset = getInlineComponentMotionPreset();
      const selector = resolveComponentScopeSelector(
        targetContext,
        scope,
        componentTemplate
      );
      if (!selector) {
        return null;
      }
      const rawText = String(targetContext?.selectedText ?? targetContext?.text ?? "").trim();
      const safeText = sanitizeComponentText(rawText);
      const html = addClassesToInlineComponentTemplate(
        applyTextToComponentTemplate(componentTemplate, safeText),
        buildInlineComponentClassName(componentTemplate, motionPreset)
      );
      const motionCss = buildInlineComponentMotionCss(motionPreset);

      const rules = [
        {
          id: `inline-component-template-${componentTemplate.id}`,
          type: "replaceNode",
          selector,
          html,
          replaceOnce: scope === "target",
          preserveText: true,
          preserveHref: true,
          preserveHtml: true,
          label: `Component template: ${componentTemplate.name}`
        }
      ];

      if (motionCss) {
        rules.push({
          id: `inline-component-motion-${motionPreset}`,
          type: "customCss",
          css: motionCss,
          label: `Component motion: ${motionPreset}`
        });
      }

      return {
        hostname: getSiteKey(),
        summary: `应用组件模板：${componentTemplate.name}`,
        rules
      };
    }

    function normalizeInlineComponentScope(value) {
      return String(value ?? "target").trim().toLowerCase() === "page" ? "page" : "target";
    }

    function normalizeInlineComponentMotionPreset(value) {
      const normalized = String(value ?? "very-soft").trim().toLowerCase();
      if (normalized === "off" || normalized === "soft") {
        return normalized;
      }
      return "very-soft";
    }

    function normalizeInlineComponentMotionMode(value) {
      return "static";
    }

    function getInlineComponentMotionPreset() {
      return "off";
    }

    function applyInlineComponentMotionModeUi() {
      const mode = normalizeInlineComponentMotionMode(state.inline.componentMotionModeSelect?.value);
      if (state.inline.componentMotionSelect) {
        state.inline.componentMotionSelect.disabled = state.inline.busy || mode === "static";
      }
    }

    function buildInlineComponentClassName(componentTemplate, motionPreset) {
      const templateId = String(componentTemplate?.id ?? "component")
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9_-]+/g, "-");
      return [
        "cwm-inline-component-root",
        `cwm-inline-component-${templateId}`,
        `cwm-inline-motion-${motionPreset}`
      ].join(" ");
    }

    function addClassesToInlineComponentTemplate(html, className) {
      const markup = String(html ?? "").trim();
      const classes = String(className ?? "").trim();
      if (!markup || !classes) {
        return markup;
      }

      return markup.replace(/^<([a-z0-9-]+)([^>]*)>/i, (match, tagName, attributes = "") => {
        if (!/\bclass\s*=/i.test(attributes)) {
          return `<${tagName}${attributes} class="${classes}">`;
        }

        return `<${tagName}${attributes}`.replace(
          /\bclass\s*=\s*(['"])(.*?)\1/i,
          (_attrMatch, quote, existingClasses) =>
            `class=${quote}${`${existingClasses} ${classes}`.trim()}${quote}`
        ) + ">";
      });
    }

    function buildInlineComponentMotionCss(motionPreset) {
      const preset = normalizeInlineComponentMotionPreset(motionPreset);
      const selector = ".cwm-inline-component-root";

      if (preset === "off") {
        return `
${selector} {
  transition: none !important;
  animation: none !important;
}
        `.trim();
      }

      const config = preset === "soft"
        ? {
            raiseY: "1.5px",
            pressScale: "0.9985",
            shadowHover: "0 18px 34px rgba(15, 23, 42, 0.14)",
            focusRing: "0 0 0 4px rgba(49, 194, 124, 0.12)",
            moveDuration: "320ms",
            shadowDuration: "420ms"
          }
        : {
            raiseY: "1px",
            pressScale: "0.999",
            shadowHover: "0 15px 30px rgba(15, 23, 42, 0.12)",
            focusRing: "0 0 0 4px rgba(49, 194, 124, 0.10)",
            moveDuration: "460ms",
            shadowDuration: "560ms"
          };

      return `
${selector} {
  transform: translate3d(0, 0, 0);
  backface-visibility: hidden;
  will-change: transform, box-shadow, filter;
  transition-property: transform, box-shadow, filter, background-color, border-color, color;
  transition-duration: ${config.moveDuration}, ${config.shadowDuration}, ${config.shadowDuration}, ${config.shadowDuration}, ${config.shadowDuration}, ${config.shadowDuration};
  transition-timing-function: cubic-bezier(0.22, 1, 0.36, 1);
}

${selector}:hover {
  transform: translate3d(0, calc(-1 * ${config.raiseY}), 0);
  box-shadow: ${config.shadowHover};
  filter: saturate(1.01);
}

${selector}:active {
  transform: translate3d(0, 0, 0) scale(${config.pressScale});
}

${selector}:focus-visible,
${selector} :focus-visible {
  outline: none !important;
  box-shadow: ${config.shadowHover}, ${config.focusRing} !important;
}

@media (prefers-reduced-motion: reduce) {
  ${selector} {
    transition: none !important;
    animation: none !important;
  }
}
      `.trim();
    }

    function resolveComponentScopeSelector(targetContext, scope, componentTemplate) {
      const targetSelector = String(targetContext?.selector ?? "").trim();
      if (scope !== "page") {
        return targetSelector;
      }

      const targetTag = String(targetContext?.tagName ?? "").trim().toLowerCase();
      const category = String(componentTemplate?.category ?? "").toLowerCase();
      if (targetTag && !["html", "body"].includes(targetTag) && isSafePageScopeTag(targetTag, category)) {
        return targetTag;
      }

      if (category === "button") {
        return "button, a[role='button'], [role='button'], input[type='button'], input[type='submit'], .btn, [class*='button']";
      }
      if (category === "input") {
        return "input[type='text'], input[type='search'], input[type='email'], textarea";
      }
      if (category === "select") {
        return "select";
      }
      if (category === "badge") {
        return ".badge, [class*='badge'], [class*='tag'], [class*='chip'], span[role='status']";
      }
      if (category === "card") {
        return "article, section, li, .card, [class*='card'], [data-card]";
      }

      return targetSelector && !/^body$|^html$/i.test(targetSelector) ? targetSelector : "";
    }

    function applyTextToComponentTemplate(componentTemplate, text) {
      const html = String(componentTemplate?.html ?? "").trim();
      if (!html) {
        return html;
      }

      if (!text) {
        return html;
      }

      return html
        .replace(/\{\{content\}\}/g, text)
        .replace(/立即操作/g, text)
        .replace(/了解详情/g, text)
        .replace(/卡片标题/g, text)
        .replace(/推荐/g, text)
        .replace(/在线/g, text);
    }

    function isSafePageScopeTag(tagName, category) {
      const tag = String(tagName ?? "").trim().toLowerCase();
      if (!tag || ["html", "body", "main", "section", "article", "nav", "header", "footer"].includes(tag)) {
        return false;
      }

      if (category === "button") {
        return ["button", "a"].includes(tag);
      }
      if (category === "input") {
        return ["input", "textarea"].includes(tag);
      }
      if (category === "select") {
        return tag === "select";
      }
      if (category === "badge") {
        return ["span", "strong", "em", "small"].includes(tag);
      }
      if (category === "card") {
        return ["article", "section", "div", "li"].includes(tag);
      }

      return false;
    }

    function sanitizeComponentText(value) {
      return String(value ?? "")
        .replace(/\s+/g, " ")
        .trim()
        .slice(0, 32);
    }

    function applyThemeSwitchGuard() {
      let style = document.getElementById(THEME_SWITCH_GUARD_STYLE_ID);
      if (!style) {
        style = document.createElement("style");
        style.id = THEME_SWITCH_GUARD_STYLE_ID;
        style.setAttribute(OWNED_ATTRIBUTE, "true");
        (document.head || document.documentElement).appendChild(style);
      }

      style.textContent = `
html, body, html *, body * {
  transition: none !important;
  animation: none !important;
}
      `.trim();

      window.setTimeout(() => {
        if (style && style.parentNode) {
          style.remove();
        }
      }, 180);
    }

    function containsThemeTemplateRule(rules) {
      return (Array.isArray(rules) ? rules : []).some((rule) => isThemeTemplateRule(rule));
    }

    function isInlineComponentTemplateRule(rule) {
      if (!rule || typeof rule !== "object") {
        return false;
      }

      const id = String(rule.id ?? "").trim();
      const label = String(rule.label ?? "").trim().toLowerCase();
      return id.startsWith("inline-component-template-") ||
        id.startsWith("inline-component-motion-") ||
        label.startsWith("component template:") ||
        label.startsWith("component motion:");
    }

    function isThemeTemplateRule(rule) {
      if (!rule || typeof rule !== "object" || rule.type !== "customCss") {
        return false;
      }

      const css = String(rule.css ?? "").trim();
      const id = String(rule.id ?? "").trim();
      return css.includes("/* cwm-theme-template */") || id.startsWith("inline-theme-template-");
    }

    function buildInlineRuleNarrative(ruleSet) {
      const rules = Array.isArray(ruleSet?.rules) ? ruleSet.rules : [];
      if (rules.length === 0) {
        return "AI 已经理解你的需求，但这次没有产出可用修改。你可以换一种更直接的说法。";
      }

      const lines = [
        String(ruleSet?.summary ?? "").trim() || `这次会改 ${rules.length} 处内容。`,
        ...rules.slice(0, 4).map((rule) => `- ${getInlineRuleTitle(rule)}`)
      ];

      if (rules.length > 4) {
        lines.push(`- 另外还有 ${rules.length - 4} 处联动微调`);
      }

      return lines.join("\n");
    }

    function getInlineRuleTitle(rule) {
      switch (rule?.type) {
        case "style":
          return "调整这块区域的颜色或样式";
        case "hide":
          return "隐藏这块区域";
        case "setText":
          return `把文字改成“${String(rule.text ?? "").slice(0, 24)}”`;
        case "textReplace":
          return `替换其中一段文字`;
        case "attribute":
          return "修改这个区域的属性";
        case "customCss":
          return "对整体外观做进一步细调";
        case "replaceNode":
          return "将该目标替换为新的 UI 组件模板";
        case "moveNode":
          return "把这块内容拖到新的页面位置";
        case "pinNode":
          return "把这个元素固定摆放到新的屏幕位置";
        default:
          return "应用一条网页修改";
      }
    }

    async function sendRuntimeMessage(payload) {
      let timeoutId = null;
      const timeoutPromise = new Promise((_, reject) => {
        timeoutId = window.setTimeout(() => {
          reject(new Error("请求超时，请检查模型接口是否仍在响应，然后再试一次。"));
        }, RUNTIME_MESSAGE_TIMEOUT_MS);
      });

      let response;

      try {
        response = await Promise.race([chrome.runtime.sendMessage(payload), timeoutPromise]);
      } finally {
        window.clearTimeout(timeoutId);
      }

      if (!response?.ok) {
        throw new Error(response?.error ?? "The extension request failed.");
      }

      return response;
    }

    function findPinnedElementsBySourceSelector(selector) {
      const normalizedSelector = String(selector ?? "").trim();
      if (!normalizedSelector) {
        return [];
      }

      return Array.from(document.querySelectorAll(`[${PIN_SOURCE_ATTRIBUTE}]`)).filter(
        (element) =>
          !isExtensionOwnedElement(element) &&
          !element.hasAttribute(PIN_SUPPRESSED_DUPLICATE_ATTRIBUTE) &&
          element.getAttribute(PIN_SOURCE_ATTRIBUTE) === normalizedSelector
      );
    }

    function findDirectMatchesBySelector(selector, { exclude = null } = {}) {
      const normalizedSelector = String(selector ?? "").trim();
      if (!normalizedSelector) {
        return [];
      }

      try {
        return Array.from(document.querySelectorAll(normalizedSelector)).filter(
          (element) =>
            !isExtensionOwnedElement(element) &&
            element !== exclude &&
            !element.hasAttribute(PIN_ADOPTED_PLACEHOLDER_ATTRIBUTE) &&
            !element.hasAttribute(PIN_SUPPRESSED_DUPLICATE_ATTRIBUTE)
        );
      } catch {
        return [];
      }
    }

    function queryAll(selector) {
      const normalizedSelector = String(selector ?? "").trim();
      const pinnedMatches = findPinnedElementsBySourceSelector(normalizedSelector);
      const directMatches = findDirectMatchesBySelector(normalizedSelector);

      return Array.from(new Set([...pinnedMatches, ...directMatches]))
        .slice(0, 60);
    }

    function hasRelevantMutations(mutations) {
      return mutations.some((mutation) => {
        if (!isExtensionOwnedNode(mutation.target)) {
          return true;
        }

        const changedNodes = [...mutation.addedNodes, ...mutation.removedNodes];
        return changedNodes.some((node) => !isExtensionOwnedNode(node));
      });
    }

    function isExtensionOwnedNode(node) {
      if (node instanceof Element) {
        return isExtensionOwnedElement(node);
      }

      return node?.parentElement instanceof Element
        ? isExtensionOwnedElement(node.parentElement)
        : false;
    }

    function isExtensionOwnedElement(element) {
      if (!(element instanceof Element)) {
        return false;
      }

      return Boolean(element.closest(`[${OWNED_ATTRIBUTE}="true"]`));
    }

    function sanitizeRuleSet(value) {
      if (!value || typeof value !== "object" || !Array.isArray(value.rules)) {
        return null;
      }

      return {
        hostname: String(value.hostname ?? "").trim().toLowerCase(),
        summary: String(value.summary ?? "").trim(),
        rules: value.rules
          .filter((rule) => rule && typeof rule === "object")
          .map((rule, index) => ({
            id: String(rule.id ?? `rule-${index + 1}`),
            type: String(rule.type ?? "").trim(),
            selector: String(rule.selector ?? "").trim(),
            targetParentSelector: String(rule.targetParentSelector ?? rule.parentSelector ?? "").trim(),
            beforeSelector: String(rule.beforeSelector ?? "").trim(),
            documentLeft: Number.parseFloat(rule.documentLeft),
            documentTop: Number.parseFloat(rule.documentTop),
            left: Number.parseFloat(rule.left),
            top: Number.parseFloat(rule.top),
            width: Number.parseFloat(rule.width),
            height: Number.parseFloat(rule.height),
            zIndex: Number.parseInt(rule.zIndex, 10),
            declarations:
              rule.declarations && typeof rule.declarations === "object"
                ? rule.declarations
                : {},
            text: String(rule.text ?? ""),
            find: String(rule.find ?? ""),
            replace: String(rule.replace ?? ""),
            matchCase: Boolean(rule.matchCase),
            replaceOnce: Boolean(rule.replaceOnce),
            attribute: String(rule.attribute ?? ""),
            value: String(rule.value ?? ""),
            css: String(rule.css ?? ""),
            html: String(rule.html ?? rule.templateHtml ?? ""),
            preserveText: Boolean(rule.preserveText),
            preserveHref: Boolean(rule.preserveHref),
            preserveHtml: Boolean(rule.preserveHtml),
            label: String(rule.label ?? "")
          }))
      };
    }

    function getSiteKey() {
      return String(location.hostname ?? "").trim().toLowerCase();
    }

    function countSelectorMatches(selector) {
      const normalizedSelector = String(selector ?? "").trim();
      if (!normalizedSelector) {
        return 0;
      }

      try {
        return document.querySelectorAll(normalizedSelector).length;
      } catch {
        return 0;
      }
    }

    function isSelectorUnique(selector, expectedElement = null) {
      const normalizedSelector = String(selector ?? "").trim();
      if (!normalizedSelector) {
        return false;
      }

      try {
        const matches = Array.from(document.querySelectorAll(normalizedSelector)).filter(
          (element) =>
            !isExtensionOwnedElement(element) &&
            !element.hasAttribute(PIN_ADOPTED_PLACEHOLDER_ATTRIBUTE) &&
            !element.hasAttribute(PIN_SUPPRESSED_DUPLICATE_ATTRIBUTE)
        );

        if (matches.length !== 1) {
          return false;
        }

        return !(expectedElement instanceof Element) || matches[0] === expectedElement;
      } catch {
        return false;
      }
    }

    function getStableAttributeSelector(element) {
      if (!(element instanceof Element)) {
        return "";
      }

      const attributeCandidates = [
        "data-testid",
        "data-test",
        "data-qa"
      ];

      for (const attributeName of attributeCandidates) {
        const attributeValue = String(element.getAttribute(attributeName) ?? "").trim();
        if (attributeValue) {
          return `[${attributeName}="${escapeAttributeValue(attributeValue)}"]`;
        }
      }

      return "";
    }

    function buildSelectorSegment(element) {
      if (!(element instanceof Element)) {
        return "";
      }

      let segment = element.tagName.toLowerCase();

      const stableAttributeSelector = getStableAttributeSelector(element);
      if (stableAttributeSelector) {
        segment += stableAttributeSelector;
      }

      const ariaLabel = String(element.getAttribute("aria-label") ?? "").trim();
      if (ariaLabel && ariaLabel.length <= 80) {
        segment += `[aria-label="${escapeAttributeValue(ariaLabel)}"]`;
      }

      if (!stableAttributeSelector && !ariaLabel) {
        const classes = Array.from(element.classList || [])
          .filter((className) => className && !/^\d/.test(className))
          .slice(0, 2)
          .map((className) => `.${escapeSelectorToken(className)}`)
          .join("");
        segment += classes;
      }

      if (element.parentElement) {
        const siblings = Array.from(element.parentElement.children).filter(
          (child) => child.tagName === element.tagName
        );
        if (siblings.length > 1) {
          const index = siblings.indexOf(element) + 1;
          if (index > 0) {
            segment += `:nth-of-type(${index})`;
          }
        }
      }

      return segment;
    }

    function buildSelector(element) {
      if (!(element instanceof Element)) {
        return "";
      }

      const pinnedSourceSelector = String(element.getAttribute?.(PIN_SOURCE_ATTRIBUTE) ?? "").trim();
      if (pinnedSourceSelector) {
        return pinnedSourceSelector;
      }

      if (element.id) {
        const idSelector = `#${escapeSelectorToken(element.id)}`;
        if (isSelectorUnique(idSelector, element)) {
          return idSelector;
        }
      }

      const stableAttributeSelector = getStableAttributeSelector(element);
      if (stableAttributeSelector) {
        const testSelector = stableAttributeSelector;
        if (isSelectorUnique(testSelector, element)) {
          return testSelector;
        }
      }

      const segments = [];
      let current = element;
      let depth = 0;
      let bestSelector = "";

      while (current && current.nodeType === Node.ELEMENT_NODE && depth < 12) {
        if (current.id) {
          segments.unshift(`#${escapeSelectorToken(current.id)}`);
        } else {
          const segment = buildSelectorSegment(current);
          if (!segment) {
            break;
          }
          segments.unshift(segment);
        }

        const selector = segments.join(" > ");
        if (selector) {
          bestSelector = selector;
          if (isSelectorUnique(selector, element)) {
            return selector;
          }
        }

        current = current.parentElement;
        depth += 1;

        if (current?.id) {
          const anchoredSelector = [`#${escapeSelectorToken(current.id)}`, ...segments].join(" > ");
          if (isSelectorUnique(anchoredSelector, element)) {
            return anchoredSelector;
          }
          bestSelector = anchoredSelector;
          break;
        }
      }

      if (bestSelector && countSelectorMatches(bestSelector) > 0) {
        return bestSelector;
      }

      return buildSelectorSegment(element);
    }

    function getElementText(element) {
      const rawText = String(
        element.textContent ||
          element.getAttribute?.("aria-label") ||
          element.getAttribute?.("title") ||
          element.getAttribute?.("alt") ||
          element.getAttribute?.("placeholder") ||
          ""
      );

      return rawText.replace(/\s+/g, " ").trim().slice(0, 180);
    }

    function toKebabCase(value) {
      return String(value ?? "")
        .trim()
        .replace(/[A-Z]/g, (character) => `-${character.toLowerCase()}`);
    }

    function escapeForRegExp(value) {
      return String(value ?? "").replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    }

    function escapeSelectorToken(value) {
      return String(value ?? "").replace(/[^a-zA-Z0-9_-]/g, "\\$&");
    }

    function escapeAttributeValue(value) {
      return String(value ?? "").replace(/"/g, '\\"');
    }
  })();
}

