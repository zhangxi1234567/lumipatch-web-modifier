const THEME_TEMPLATES = [
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
  }
];

const state = {
  settings: null,
  site: null,
  savedRuleSet: null,
  savedHistory: null,
  generatedRuleSet: null,
  assistantText: "",
  busy: false
};

const workspaceTitleNode = document.querySelector("#workspace-title");
const siteTitleNode = document.querySelector("#site-title");
const siteHostnameNode = document.querySelector("#site-hostname");
const siteUrlNode = document.querySelector("#site-url");
const modelPillNode = document.querySelector("#model-pill");
const endpointPillNode = document.querySelector("#endpoint-pill");
const promptField = document.querySelector("#prompt");
const statusNode = document.querySelector("#status");
const generatedSummaryNode = document.querySelector("#generated-summary");
const generatedCountNode = document.querySelector("#generated-count");
const generatedRulesListNode = document.querySelector("#generated-rules-list");
const generatedRulesEmptyNode = document.querySelector("#generated-rules-empty");
const savedRulesListNode = document.querySelector("#saved-rules-list");
const savedRulesEmptyNode = document.querySelector("#saved-rules-empty");
const savedHistoryMetaNode = document.querySelector("#saved-history-meta");
const assistantOutputNode = document.querySelector("#assistant-output");
const refreshSiteButton = document.querySelector("#refresh-site");
const openOptionsButton = document.querySelector("#open-options");
const previewSavedButton = document.querySelector("#preview-saved");
const deleteSavedButton = document.querySelector("#delete-saved");
const undoSavedButton = document.querySelector("#undo-saved");
const redoSavedButton = document.querySelector("#redo-saved");
const exportSavedButton = document.querySelector("#export-saved");
const importSavedButton = document.querySelector("#import-saved");
const importFileInput = document.querySelector("#import-file-input");
const clearPreviewButton = document.querySelector("#clear-preview");
const generatorForm = document.querySelector("#generator-form");
const generateButton = document.querySelector("#generate-button");
const previewGeneratedButton = document.querySelector("#preview-generated");
const saveGeneratedButton = document.querySelector("#save-generated");
const ruleItemTemplate = document.querySelector("#rule-item-template");
const themeTemplateSearchInput = document.querySelector("#theme-template-search");
const themeTemplateToneSelect = document.querySelector("#theme-template-tone");
const themeTemplateSelect = document.querySelector("#theme-template-select");
const previewThemeTemplateButton = document.querySelector("#preview-theme-template");
const saveThemeTemplateButton = document.querySelector("#save-theme-template");

bootstrap().catch((error) => {
  setStatus(error instanceof Error ? error.message : "初始化失败。", "error");
});

refreshSiteButton.addEventListener("click", () => {
  void runAction(refreshSiteState);
});

openOptionsButton.addEventListener("click", () => {
  chrome.runtime.openOptionsPage();
});

previewSavedButton.addEventListener("click", () => {
  if (!state.savedRuleSet) {
    setStatus("这个网站还没有保存效果，暂时没法预览。", "error");
    return;
  }

  void runAction(() =>
    previewRuleSet(state.savedRuleSet, "已把保存过的效果重新预览到当前网页。")
  );
});

deleteSavedButton.addEventListener("click", () => {
  if (!state.savedRuleSet) {
    setStatus("这个网站还没有保存效果，没东西可删。", "error");
    return;
  }

  void runAction(deleteSavedRules);
});

clearPreviewButton.addEventListener("click", () => {
  void runAction(clearPreview);
});

undoSavedButton?.addEventListener("click", () => {
  void runAction(undoSavedRules);
});

redoSavedButton?.addEventListener("click", () => {
  void runAction(redoSavedRules);
});

exportSavedButton?.addEventListener("click", () => {
  void runAction(exportSavedRules);
});

importSavedButton?.addEventListener("click", () => {
  importFileInput?.click();
});

importFileInput?.addEventListener("change", (event) => {
  void runAction(() => importSavedRulesFromFile(event));
});

previewGeneratedButton.addEventListener("click", () => {
  if (!state.generatedRuleSet) {
    setStatus("先让 AI 生成修改，再谈预览。", "error");
    return;
  }

  void runAction(() =>
    previewRuleSet(state.generatedRuleSet, "已把这次生成的效果预览到网页上。")
  );
});

saveGeneratedButton.addEventListener("click", () => {
  if (!state.generatedRuleSet) {
    setStatus("先生成一次修改效果，才能保存。", "error");
    return;
  }

  void runAction(saveGeneratedRules);
});

generatorForm.addEventListener("submit", (event) => {
  event.preventDefault();
  void runAction(generateRules);
});

previewThemeTemplateButton?.addEventListener("click", () => {
  void runAction(previewThemeTemplate);
});

saveThemeTemplateButton?.addEventListener("click", () => {
  void runAction(saveThemeTemplate);
});

themeTemplateSearchInput?.addEventListener("input", () => {
  renderThemeTemplateOptions();
});

themeTemplateToneSelect?.addEventListener("change", () => {
  renderThemeTemplateOptions();
});

async function bootstrap() {
  renderThemeTemplateOptions();
  await refreshSiteState();
}

async function refreshSiteState() {
  setBusy(true);

  try {
    const result = await sendExtensionMessage({ type: "site:inspect" });
    state.settings = result.settings;
    state.site = result.site;
    state.savedRuleSet = result.savedRuleSet;
    state.savedHistory = result.history ?? null;
    workspaceTitleNode.textContent = result.settings.workspaceName;
    modelPillNode.textContent = result.settings.model;
    endpointPillNode.textContent = result.settings.baseUrl;
    renderSite();
    renderRuleSections();
    setStatus("当前网站信息已刷新。", "success");
  } finally {
    setBusy(false);
  }
}

async function generateRules() {
  const instruction = promptField.value.trim();
  if (!instruction) {
    setStatus("先直接说你想怎么改。", "error");
    return;
  }

  setBusy(true);
  setStatus("AI 正在理解你的需求并准备直接修改网页...", "info");

  try {
    const result = await sendExtensionMessage({
      type: "rules:generate",
      instruction
    });

    state.site = result.site;
    state.generatedRuleSet = result.ruleSet;
    state.assistantText = result.assistantText;
    state.savedRuleSet = await loadCurrentSavedRulesPreservingFallback(result);

    renderSite();
    renderRuleSections();
    assistantOutputNode.textContent = buildFriendlyRuleNarrative(state.generatedRuleSet);

    setStatus(
      result.previewApplied
        ? "已经直接帮你改出来了，你可以继续微调或直接永久保存。"
        : "已经生成修改方案，你可以先预览再决定要不要保存。",
      "success"
    );
  } finally {
    setBusy(false);
  }
}

async function saveGeneratedRules() {
  setBusy(true);

  try {
    const result = await sendExtensionMessage({
      type: "rules:save",
      ruleSet: state.generatedRuleSet
    });

    applySavedMutationResult(result);
    setStatus("这次效果已经保存，以后打开这个网站会自动生效。", "success");
  } finally {
    setBusy(false);
  }
}

async function deleteSavedRules() {
  setBusy(true);

  try {
    const result = await sendExtensionMessage({
      type: "rules:delete"
    });

    applySavedMutationResult(result);
    setStatus("这个网站保存过的效果已经删除。", "success");
  } finally {
    setBusy(false);
  }
}

async function undoSavedRules() {
  if (!state.savedHistory?.canUndo) {
    setStatus("There is nothing to undo for this site yet.", "error");
    return;
  }

  setBusy(true);

  try {
    const result = await sendExtensionMessage({
      type: "rules:undo"
    });

    applySavedMutationResult(result);
    setStatus("已经撤销上一步保存的修改。", "success");
  } finally {
    setBusy(false);
  }
}

async function redoSavedRules() {
  if (!state.savedHistory?.canRedo) {
    setStatus("There is nothing to redo for this site yet.", "error");
    return;
  }

  setBusy(true);

  try {
    const result = await sendExtensionMessage({
      type: "rules:redo"
    });

    applySavedMutationResult(result);
    setStatus("已经重做刚才撤销的修改。", "success");
  } finally {
    setBusy(false);
  }
}

async function exportSavedRules() {
  if (!state.savedRuleSet || !state.site?.hostname) {
    setStatus("Save rules for this site before exporting them.", "error");
    return;
  }

  setBusy(true);

  try {
    const result = await sendExtensionMessage({
      type: "rules:export"
    });

    downloadJsonFile(result.payload, `${state.site.hostname}-claude-web-modifier-rules.json`);
    setStatus("已经导出备份文件。你自己平时不用看里面内容。", "success");
  } finally {
    setBusy(false);
  }
}

async function importSavedRulesFromFile(event) {
  const input = event.target;
  const file = input?.files?.[0];

  if (!file) {
    return;
  }

  setBusy(true);

  try {
    const rawText = await file.text();
    let payload;

    try {
      payload = JSON.parse(rawText);
    } catch {
      throw new Error("The selected file was not valid JSON.");
    }

    const result = await sendExtensionMessage({
      type: "rules:import",
      payload
    });

    applySavedMutationResult(result);
    setStatus("备份已经导入，这个网站会立刻按导入效果显示。", "success");
  } finally {
    if (input) {
      input.value = "";
    }

    setBusy(false);
  }
}

async function previewRuleSet(ruleSet, successMessage) {
  setBusy(true);

  try {
    await sendExtensionMessage({
      type: "rules:preview",
      ruleSet
    });

    setStatus(successMessage, "success");
  } finally {
    setBusy(false);
  }
}

async function clearPreview() {
  setBusy(true);

  try {
    await sendExtensionMessage({
      type: "rules:clear-preview"
    });

    setStatus("当前预览已经清掉。", "success");
  } finally {
    setBusy(false);
  }
}

async function previewThemeTemplate() {
  const selectedTheme = getSelectedThemeTemplate();
  if (!selectedTheme) {
    setStatus("先选择一个主题模板。", "error");
    return;
  }

  const themeRuleSet = buildThemeTemplateRuleSet(selectedTheme);
  await previewRuleSet(themeRuleSet, `已预览主题：${selectedTheme.name}`);
}

async function saveThemeTemplate() {
  const selectedTheme = getSelectedThemeTemplate();
  if (!selectedTheme) {
    setStatus("先选择一个主题模板。", "error");
    return;
  }

  if (!state.site?.hostname) {
    setStatus("请先打开一个正常网页再保存主题。", "error");
    return;
  }

  const themeRuleSet = buildThemeTemplateRuleSet(selectedTheme);
  setBusy(true);

  try {
    const result = await sendExtensionMessage({
      type: "rules:save",
      ruleSet: themeRuleSet,
      merge: true
    });

    applySavedMutationResult(result);
    setStatus(`主题已保存：${selectedTheme.name}`, "success");
  } finally {
    setBusy(false);
  }
}

function renderSite() {
  siteTitleNode.textContent = state.site?.title || "还没有选中网站";
  siteHostnameNode.textContent = state.site?.hostname || "-";
  siteUrlNode.textContent = state.site?.url || "先打开一个正常网页再开始。";
}

function renderRuleSections() {
  renderRuleList({
    ruleSet: state.generatedRuleSet,
    summaryNode: generatedSummaryNode,
    countNode: generatedCountNode,
    emptyNode: generatedRulesEmptyNode,
    listNode: generatedRulesListNode,
    emptyText: "先说一句你想怎么改，AI 才能直接帮你改。"
  });

  renderRuleList({
    ruleSet: state.savedRuleSet,
    summaryNode: null,
    countNode: null,
    emptyNode: savedRulesEmptyNode,
    listNode: savedRulesListNode,
    emptyText: "这个网站还没有保存过效果。"
  });

  renderSavedHistoryState();
}

function renderRuleList({ ruleSet, summaryNode, countNode, emptyNode, listNode, emptyText }) {
  const rules = Array.isArray(ruleSet?.rules) ? ruleSet.rules : [];

  if (summaryNode) {
    summaryNode.textContent =
      String(ruleSet?.summary ?? "").trim() || "AI 会把准备好的修改思路显示在这里。";
  }

  if (countNode) {
    countNode.textContent = `${rules.length} 处`;
  }

  listNode.innerHTML = "";

  if (rules.length === 0) {
    emptyNode.hidden = false;
    emptyNode.textContent = emptyText;
    listNode.hidden = true;
    return;
  }

  emptyNode.hidden = true;
  listNode.hidden = false;

  for (const rule of rules) {
    const fragment = ruleItemTemplate.content.cloneNode(true);
    fragment.querySelector(".rule-type").textContent = getFriendlyRuleType(rule);
    fragment.querySelector(".rule-selector").textContent = getFriendlyRuleTarget(rule);
    fragment.querySelector(".rule-label").textContent = getFriendlyRuleTitle(rule);
    fragment.querySelector(".rule-meta").textContent = getFriendlyRuleMeta(rule);
    listNode.appendChild(fragment);
  }
}

function setBusy(nextBusy) {
  state.busy = nextBusy;
  generateButton.disabled = nextBusy;
  previewGeneratedButton.disabled = nextBusy || !state.generatedRuleSet;
  saveGeneratedButton.disabled = nextBusy || !state.generatedRuleSet;
  previewSavedButton.disabled = nextBusy || !state.savedRuleSet;
  deleteSavedButton.disabled = nextBusy || !state.savedRuleSet;
  undoSavedButton && (undoSavedButton.disabled = nextBusy || !state.savedHistory?.canUndo);
  redoSavedButton && (redoSavedButton.disabled = nextBusy || !state.savedHistory?.canRedo);
  exportSavedButton && (exportSavedButton.disabled = nextBusy || !state.savedRuleSet);
  importSavedButton && (importSavedButton.disabled = nextBusy);
  clearPreviewButton.disabled = nextBusy;
  refreshSiteButton.disabled = nextBusy;
  previewThemeTemplateButton &&
    (previewThemeTemplateButton.disabled = nextBusy || !state.site?.hostname);
  saveThemeTemplateButton &&
    (saveThemeTemplateButton.disabled = nextBusy || !state.site?.hostname);
}

function setStatus(message, tone = "") {
  const text = String(message ?? "").trim();
  statusNode.hidden = !text;
  statusNode.textContent = text;
  statusNode.dataset.tone = tone;
}

async function sendExtensionMessage(payload) {
  const response = await chrome.runtime.sendMessage(payload);
  if (!response?.ok) {
    throw new Error(response?.error ?? "The extension request failed.");
  }

  return response;
}

async function loadCurrentSavedRulesPreservingFallback(result) {
  if (result?.savedRuleSet) {
    return result.savedRuleSet;
  }

  return state.savedRuleSet;
}

function renderSavedHistoryState() {
  if (!savedHistoryMetaNode) {
    return;
  }

  if (!state.savedRuleSet) {
    savedHistoryMetaNode.textContent = "这个网站还没有保存过效果。";
    return;
  }

  const undoCount = Number(state.savedHistory?.undoCount ?? 0);
  const redoCount = Number(state.savedHistory?.redoCount ?? 0);
  savedHistoryMetaNode.textContent = `历史记录：可撤销 ${undoCount} 步，可重做 ${redoCount} 步。`;
}

function applySavedMutationResult(result) {
  state.savedRuleSet = result.ruleSet ?? null;
  state.savedHistory = result.history ?? state.savedHistory;
  renderRuleSections();
}

async function runAction(action) {
  try {
    await action();
  } catch (error) {
    setStatus(error instanceof Error ? error.message : "操作失败，请再试一次。", "error");
  }
}

function downloadJsonFile(payload, filename) {
  const blob = new Blob([JSON.stringify(payload, null, 2)], {
    type: "application/json"
  });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  setTimeout(() => URL.revokeObjectURL(url), 0);
}

function buildFriendlyRuleNarrative(ruleSet) {
  const rules = Array.isArray(ruleSet?.rules) ? ruleSet.rules : [];
  if (rules.length === 0) {
    return "AI 会先理解你的话，再直接把网页效果改出来，不再给你看 JSON。";
  }

  const lines = [
    String(ruleSet?.summary ?? "").trim() || `这次会改 ${rules.length} 处内容。`,
    ...rules.slice(0, 5).map((rule) => `- ${getFriendlyRuleTitle(rule)}`)
  ];

  if (rules.length > 5) {
    lines.push(`- 另外还有 ${rules.length - 5} 处联动调整`);
  }

  return lines.join("\n");
}

function getFriendlyRuleType(rule) {
  switch (rule?.type) {
    case "style":
      return "样式";
    case "hide":
      return "隐藏";
    case "setText":
      return "改文字";
    case "textReplace":
      return "替换文字";
    case "attribute":
      return "改属性";
    case "customCss":
      return "细调";
    case "moveNode":
      return "跟随页面";
    case "pagePinNode":
      return "跟随页面";
    case "pinNode":
      return "固定屏幕";
    default:
      return "修改";
  }
}

function getFriendlyRuleTarget(rule) {
  if (rule?.type === "customCss") {
    return "整体页面";
  }

  if (rule?.type === "moveNode") {
    return "跟随页面滚动";
  }

  if (rule?.type === "pagePinNode") {
    return "跟随页面滚动";
  }

  if (rule?.type === "pinNode") {
    return "固定在屏幕位置";
  }

  return rule?.selector ? "已锁定目标区域" : "当前页面";
}

function getFriendlyRuleTitle(rule) {
  switch (rule?.type) {
    case "style":
      return "调整这个区域的颜色或外观";
    case "hide":
      return "把这个区域隐藏起来";
    case "setText":
      return `把文字改成“${String(rule.text ?? "").slice(0, 24)}”`;
    case "textReplace":
      return `把“${String(rule.find ?? "").slice(0, 12)}”替换成“${String(rule.replace ?? "").slice(0, 12)}”`;
    case "attribute":
      return "修改这个区域的属性";
    case "customCss":
      return "对整体样式做进一步微调";
    case "moveNode":
      return "把这个区域拖到新的页面位置";
    case "pagePinNode":
      return "把这个元素放到页面里的新位置，并随页面一起滚动";
    case "pinNode":
      return "把这个元素固定摆放到当前屏幕位置";
    default:
      return "应用一条网页修改";
  }
}

function getFriendlyRuleMeta(rule) {
  switch (rule?.type) {
    case "style":
      return "通常用于改配色、圆角、间距、宽度、字体大小这些外观效果。";
    case "hide":
      return "这块内容会先从页面上收起来，你随时可以撤销。";
    case "setText":
      return "会直接把当前区域看到的文字换成新的内容。";
    case "textReplace":
      return "会只替换命中的那段字，不会整块乱改。";
    case "attribute":
      return "适合改链接、占位词、标题提示这些内容。";
    case "customCss":
      return "用于一些普通按钮不太好表达的整体外观细调。";
    case "moveNode":
      return "会把原来的真实节点搬到新的容器或新的顺序位置，不是视觉假象。";
    case "pagePinNode":
      return "会按页面坐标保存当前位置，滚动页面时它会跟着网页内容一起移动。";
    case "pinNode":
      return "会保留原来的活元素，并把它固定在你拖到的屏幕位置，滚动页面时也继续悬浮。";
    default:
      return "这条修改会直接作用到当前网页。";
  }
}

function normalizeThemeSearchQuery(query) {
  return String(query ?? "").trim().toLowerCase();
}

function parseHexColor(hex) {
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

function getRelativeLuminance(rgb) {
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

function getThemeLightness(theme) {
  const bg = getRelativeLuminance(parseHexColor(theme?.colors?.bg));
  const card = getRelativeLuminance(parseHexColor(theme?.colors?.card));
  return bg * 0.7 + card * 0.3;
}

function getThemeSortPriority(theme) {
  if (theme?.id === "soft_mist_blue_pink") {
    return -1;
  }
  return 0;
}

function isLightTheme(theme) {
  return getThemeLightness(theme) >= 0.62;
}

function normalizeThemeToneFilter(value) {
  const normalized = String(value ?? "all").trim().toLowerCase();
  if (normalized === "light" || normalized === "dark") {
    return normalized;
  }
  return "all";
}

function matchesThemeTone(theme, tone) {
  if (tone === "all") {
    return true;
  }
  const light = isLightTheme(theme);
  return tone === "light" ? light : !light;
}

function matchesThemeKeyword(theme, keyword) {
  if (!keyword) {
    return true;
  }
  const name = String(theme?.name ?? "").toLowerCase();
  const id = String(theme?.id ?? "").toLowerCase();
  return name.includes(keyword) || id.includes(keyword);
}

function getVisibleThemeTemplates() {
  const keyword = normalizeThemeSearchQuery(themeTemplateSearchInput?.value);
  const tone = normalizeThemeToneFilter(themeTemplateToneSelect?.value);
  return THEME_TEMPLATES
    .filter((theme) => matchesThemeKeyword(theme, keyword) && matchesThemeTone(theme, tone))
    .slice()
    .sort((left, right) => {
      const priorityGap = getThemeSortPriority(left) - getThemeSortPriority(right);
      if (priorityGap !== 0) {
        return priorityGap;
      }
      const lightnessGap = getThemeLightness(right) - getThemeLightness(left);
      if (Math.abs(lightnessGap) > 0.0001) {
        return lightnessGap;
      }
      return String(left.name).localeCompare(String(right.name), "zh-Hans-CN");
    });
}

function renderThemeTemplateOptions() {
  if (!themeTemplateSelect) {
    return;
  }

  const previousSelectedId = String(themeTemplateSelect.value ?? "").trim();
  const visibleThemes = getVisibleThemeTemplates();
  themeTemplateSelect.innerHTML = "";

  if (visibleThemes.length === 0) {
    const emptyOption = document.createElement("option");
    emptyOption.value = "";
    emptyOption.textContent = "未找到匹配模板";
    emptyOption.disabled = true;
    emptyOption.selected = true;
    themeTemplateSelect.appendChild(emptyOption);
    return;
  }

  for (const theme of visibleThemes) {
    const option = document.createElement("option");
    option.value = theme.id;
    option.textContent = theme.name;
    themeTemplateSelect.appendChild(option);
  }

  const selectedId = visibleThemes.some((theme) => theme.id === previousSelectedId)
    ? previousSelectedId
    : visibleThemes[0].id;
  themeTemplateSelect.value = selectedId;
}

function getSelectedThemeTemplate() {
  if (!themeTemplateSelect) {
    return null;
  }

  const selectedId = String(themeTemplateSelect.value ?? "").trim();
  return THEME_TEMPLATES.find((theme) => theme.id === selectedId) ?? null;
}

function buildThemeTemplateRuleSet(theme) {
  const colors = theme.colors;

  const css = `
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
  background: linear-gradient(145deg, var(--cwm-theme-bg) 0%, var(--cwm-theme-bg-soft) 52%, var(--cwm-theme-accent) 100%) !important;
  background-color: var(--cwm-theme-bg) !important;
  color: var(--cwm-theme-text) !important;
}
main, section, article, aside, nav, header, footer, div, ul, ol, li,
[class*="bg"], [class*="background"], [class*="container"], [class*="wrapper"],
[class*="panel"], [class*="content"], [class*="layout"], [class*="module"],
[class*="box"], [class*="shell"], [class*="surface"], [class*="block"] {
  background: linear-gradient(135deg, var(--cwm-theme-card) 0%, var(--cwm-theme-bg-soft) 100%) !important;
  background-color: var(--cwm-theme-card) !important;
  color: var(--cwm-theme-text) !important;
  border-color: var(--cwm-theme-border) !important;
}
a, a:visited {
  color: var(--cwm-theme-accent-strong) !important;
}
button, [role="button"], .btn, [class*="button"], [class*="btn-"] {
  background: linear-gradient(130deg, var(--cwm-theme-accent), var(--cwm-theme-accent-strong)) !important;
  border-color: var(--cwm-theme-accent-strong) !important;
  color: white !important;
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
  background: linear-gradient(135deg, var(--cwm-theme-card) 0%, var(--cwm-theme-bg-soft) 100%) !important;
  border-color: var(--cwm-theme-border) !important;
  color: var(--cwm-theme-text) !important;
}
table, thead, tbody, tr, th, td {
  background-color: var(--cwm-theme-card) !important;
  border-color: var(--cwm-theme-border) !important;
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
  background: linear-gradient(135deg, var(--cwm-theme-card) 0%, var(--cwm-theme-bg-soft) 100%) !important;
  background-color: var(--cwm-theme-card) !important;
}
.color-fg-default, .color-fg-muted {
  color: var(--cwm-theme-text) !important;
}
  `.trim();

  return {
    hostname: state.site?.hostname ?? "",
    summary: `应用主题模板：${theme.name}`,
    rules: [
      {
        id: `theme-template-${theme.id}`,
        type: "customCss",
        css,
        label: `Theme template: ${theme.name}`
      }
    ]
  };
}
