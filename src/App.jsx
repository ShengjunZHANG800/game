import { useMemo, useState } from 'react'
import './App.css'

const VERSION = 1
const generatedArt = import.meta.glob('./assets/generated/*.webp', { eager: true, query: '?url', import: 'default' })
const artUrl = (fileName) => generatedArt[`./assets/generated/${fileName}`] ?? ''
const locationArt = {
  capital: artUrl('location-capital.webp'),
  port: artUrl('location-port.webp'),
  mine: artUrl('location-mine.webp'),
  forest: artUrl('location-forest.webp'),
  fort: artUrl('location-fort.webp'),
  oasis: artUrl('location-oasis.webp'),
  academy: artUrl('location-academy.webp'),
  ruins: artUrl('location-ruins.webp'),
  forge: artUrl('location-forge.webp'),
}
const npcArt = {
  lina: artUrl('npc-lina.webp'),
  kael: artUrl('npc-kael.webp'),
  mira: artUrl('npc-mira.webp'),
  selene: artUrl('npc-selene.webp'),
  oran: artUrl('npc-oran.webp'),
  naya: artUrl('npc-naya.webp'),
  avel: artUrl('npc-avel.webp'),
  rhea: artUrl('npc-rhea.webp'),
}

const GOODS = [
  { id: 'grain', name: '星麦', base: 18, weight: 1, type: '民生', rarity: '普通', text: '王都和要塞都离不开的主粮。' },
  { id: 'spice', name: '沙海香料', base: 48, weight: 1, type: '奢侈', rarity: '优良', text: '绿洲商队带来的辛香粉末。' },
  { id: 'silk', name: '晨曦丝绸', base: 72, weight: 1, type: '奢侈', rarity: '优良', text: '贵族礼服与学院法袍的材料。' },
  { id: 'herb', name: '银叶药草', base: 36, weight: 1, type: '药材', rarity: '普通', text: '可在战斗中消耗，回复 25 点生命。' },
  { id: 'moon', name: '月露', base: 92, weight: 1, type: '魔法', rarity: '稀有', text: '月影林地凝结的炼金原液。' },
  { id: 'ore', name: '赤铁矿', base: 44, weight: 2, type: '矿物', rarity: '普通', text: '灰烬矿镇的炉火日夜吞吐。' },
  { id: 'mithril', name: '秘银锭', base: 128, weight: 2, type: '矿物', rarity: '稀有', text: '轻而坚韧，武具工坊愿出高价。' },
  { id: 'crystal', name: '星辉水晶', base: 116, weight: 1, type: '魔法', rarity: '稀有', text: '浮空学院用来稳定法阵。' },
  { id: 'scroll', name: '古法卷轴', base: 86, weight: 1, type: '知识', rarity: '优良', text: '残缺的咒式也能卖给学者。' },
  { id: 'relic', name: '古代遗物', base: 165, weight: 2, type: '遗物', rarity: '史诗', text: '遗迹猎人最爱的高风险货物。' },
  { id: 'dragonbone', name: '龙骨片', base: 210, weight: 2, type: '稀有', rarity: '传说', text: '炼器师和军需官都会抢购。' },
  { id: 'gear', name: '机关零件', base: 68, weight: 1, type: '工艺', rarity: '优良', text: '矮人工匠制造的精密齿轮。' },
  { id: 'salt', name: '霜盐', base: 40, weight: 1, type: '民生', rarity: '普通', text: '北境雪线下开采的蓝白盐晶。' },
  { id: 'wine', name: '精灵果酒', base: 102, weight: 1, type: '奢侈', rarity: '稀有', text: '月影森林的外交礼物。' },
  { id: 'pearl', name: '潮汐珍珠', base: 150, weight: 1, type: '稀有', rarity: '史诗', text: '市集港的海民会按光泽定价。' },
  { id: 'ink', name: '夜鸦墨水', base: 58, weight: 1, type: '知识', rarity: '优良', text: '抄写卷轴与签订契约必备。' },
  { id: 'amber', name: '琥珀蜜', base: 64, weight: 1, type: '民生', rarity: '优良', text: '旅店、宴会和药剂师都会收。' },
  { id: 'candle', name: '圣烛', base: 74, weight: 1, type: '宗教', rarity: '优良', text: '要塞祈祷室和遗迹探险队都要囤。' },
  { id: 'map', name: '星图残页', base: 135, weight: 1, type: '知识', rarity: '史诗', text: '学院和遗迹猎人争抢的航路线索。' },
]

const LOCATIONS = [
  { id: 'capital', name: '白塔王都', note: '贵族、银行与军需订单汇聚之地。粮食稳定便宜，丝绸、遗物、龙骨和酒往往能卖高价。', risk: 1, cost: 12, mod: { grain: 0.92, silk: 1.16, scroll: 1.08, relic: 1.22, dragonbone: 1.28, wine: 1.14, candle: 1.12 } },
  { id: 'port', name: '市集港', note: '水手、拍卖师和远洋货仓彻夜喧闹。珍珠与香料常低价入港，水晶、琥珀蜜和粮食更容易被抬价。', risk: 2, cost: 16, mod: { spice: 0.88, pearl: 0.72, wine: 0.95, grain: 1.08, crystal: 1.18, gear: 0.98, amber: 1.1 } },
  { id: 'mine', name: '灰烬矿镇', note: '矿灯照着黑岩，矿物和机关件便宜；粮食、药草、丝绸和圣烛是矿工愿意高价买的东西。', risk: 3, cost: 21, mod: { ore: 0.62, mithril: 0.74, gear: 0.86, grain: 1.18, herb: 1.2, silk: 1.32, candle: 1.16 } },
  { id: 'forest', name: '月影森林', note: '树冠间有精灵集市。药草、月露、果酒和琥珀蜜便宜，矿物、秘银和霜盐在林地更稀缺。', risk: 3, cost: 24, mod: { herb: 0.68, moon: 0.7, wine: 0.78, ore: 1.18, mithril: 1.22, salt: 1.2, amber: 0.7 } },
  { id: 'fort', name: '北境要塞', note: '军需紧缺。霜盐便宜，粮食、矿物、龙骨、香料和圣烛会被军需官高价收走。', risk: 4, cost: 30, mod: { grain: 1.28, salt: 0.76, ore: 1.12, mithril: 1.26, dragonbone: 1.18, spice: 1.35, candle: 1.35 } },
  { id: 'oasis', name: '沙海绿洲', note: '驼铃、密探和香料帐篷交错。香料和丝绸容易低买，珍珠、月露、星图残页常卖得更贵。', risk: 4, cost: 34, mod: { spice: 0.58, salt: 1.18, silk: 0.92, pearl: 1.28, moon: 1.24, ink: 1.08, map: 1.16 } },
  { id: 'academy', name: '浮空学院', note: '学徒排队买材料。水晶、卷轴和墨水常便宜，遗物、机关零件和星图残页在导师手里溢价明显。', risk: 2, cost: 28, mod: { crystal: 0.76, scroll: 0.82, ink: 0.72, moon: 1.1, relic: 1.16, gear: 1.2, map: 1.32 } },
  { id: 'ruins', name: '古龙遗迹', note: '利润最高，也最危险。遗物、龙骨、星图残页可低价淘到，粮食、药草和珍珠常因探险队需求暴涨。', risk: 5, cost: 40, mod: { relic: 0.72, dragonbone: 0.68, scroll: 0.92, herb: 1.35, grain: 1.4, pearl: 1.18, map: 0.72 } },
  { id: 'forge', name: '赤铜工坊', note: '矮人炉群接收矿物，也出产机关货。机关件和圣烛相对便宜，水晶、墨水和香料常有工坊溢价。', risk: 3, cost: 26, mod: { gear: 0.66, ore: 0.86, mithril: 1.1, crystal: 1.1, ink: 1.18, spice: 1.16, candle: 0.9 } },
]

const EQUIPMENT = [
  { id: 'knife', slot: 'weapon', name: '护身短刃', price: 160, attack: 4, defense: 0, maxHp: 0, capacity: 0, reputation: 0, rarity: '普通', source: 'shop', text: '路上遇事时至少能先手。' },
  { id: 'sabre', slot: 'weapon', name: '商队弯刀', price: 420, attack: 10, defense: 1, maxHp: 0, capacity: 0, reputation: 0, rarity: '优良', source: 'shop', text: '沙海护卫常用的弯刀。' },
  { id: 'pike', slot: 'weapon', name: '秘银长枪', price: 880, attack: 18, defense: 3, maxHp: 0, capacity: 0, reputation: 1, rarity: '稀有', source: 'shop', text: '枪尖能刺穿龙蜥鳞片。' },
  { id: 'crossbow', slot: 'weapon', name: '折叠弩机', price: 620, attack: 13, defense: 0, maxHp: 0, capacity: 3, reputation: 0, rarity: '优良', source: 'shop', text: '商队哨兵喜欢的轻便远程武器。' },
  { id: 'vest', slot: 'armor', name: '厚皮马甲', price: 190, attack: 0, defense: 5, maxHp: 8, capacity: 0, reputation: 0, rarity: '普通', source: 'shop', text: '便宜但可靠。' },
  { id: 'chain', slot: 'armor', name: '王都锁甲', price: 520, attack: 0, defense: 12, maxHp: 18, capacity: 0, reputation: 0, rarity: '优良', source: 'shop', text: '正规军退役装备。' },
  { id: 'scale', slot: 'armor', name: '龙鳞胸甲', price: 1150, attack: 3, defense: 21, maxHp: 32, capacity: 0, reputation: 1, rarity: '稀有', source: 'shop', text: '昂贵，醒目，也确实结实。' },
  { id: 'cloak', slot: 'armor', name: '夜路斗篷', price: 360, attack: 0, defense: 8, maxHp: 10, capacity: 2, reputation: 0, rarity: '优良', source: 'shop', text: '挡风、防雨，也让盗匪看不清货车规模。' },
  { id: 'ledger', slot: 'trinket', name: '精算账册', price: 300, attack: 0, defense: 0, maxHp: 0, capacity: 6, reputation: 1, rarity: '普通', source: 'shop', text: '多装几箱货，也少算错几笔账。' },
  { id: 'seal', slot: 'trinket', name: '白塔商印', price: 760, attack: 0, defense: 2, maxHp: 0, capacity: 12, reputation: 3, rarity: '稀有', source: 'shop', text: '让守卫和批发商都更愿意听你说话。' },
  { id: 'lantern', slot: 'trinket', name: '星火提灯', price: 540, attack: 1, defense: 3, maxHp: 10, capacity: 4, reputation: 1, rarity: '优良', source: 'shop', text: '夜行时照亮路标，减少迷路损耗。' },
  { id: 'ruinCharm', slot: 'trinket', name: '遗迹护符', price: 980, attack: 0, defense: 4, maxHp: 18, capacity: 4, reputation: 2, rarity: '史诗', source: 'loot', text: '古龙石门后偶尔能找到的护身符。' },
  { id: 'boneRing', slot: 'trinket', name: '龙骨戒', price: 1420, attack: 4, defense: 5, maxHp: 20, capacity: 0, reputation: 2, rarity: '传说', source: 'loot', text: '戴上后能听见远古鳞翼的低鸣。' },
  { id: 'moonMantle', slot: 'armor', name: '月影披风', price: 1040, attack: 0, defense: 16, maxHp: 22, capacity: 6, reputation: 1, rarity: '史诗', source: 'loot', text: '月影森林深处的银线织物。' },
  { id: 'sandDagger', slot: 'weapon', name: '沙海暗刃', price: 1220, attack: 22, defense: 1, maxHp: 0, capacity: 2, reputation: 1, rarity: '史诗', source: 'loot', text: '刀身会吞掉帐篷里的灯光。' },
  { id: 'stormAegis', slot: 'armor', name: '北境风盾', price: 1320, attack: 2, defense: 24, maxHp: 24, capacity: 0, reputation: 2, rarity: '史诗', source: 'loot', text: '盾缘刻着旧要塞的誓词。' },
  { id: 'starCompass', slot: 'trinket', name: '星盘罗盘', price: 1180, attack: 0, defense: 2, maxHp: 0, capacity: 14, reputation: 2, rarity: '史诗', source: 'loot', text: '指针总会偏向利润最厚的方向。' },
  { id: 'dragonLance', slot: 'weapon', name: '古龙断枪', price: 1680, attack: 30, defense: 4, maxHp: 10, capacity: 0, reputation: 3, rarity: '传说', source: 'loot', text: '枪杆断过一次，杀意却没有断。' },
  { id: 'routeBoots', slot: 'armor', name: '驿路轻靴', price: 460, attack: 0, defense: 4, maxHp: 6, capacity: 4, reputation: 0, rarity: '优良', source: 'shop', passive: { routeDiscount: 0.06 }, text: '鞋底缝着驿站符钉，长路少磨脚也少磨钱。' },
  { id: 'merchantAbacus', slot: 'trinket', name: '铁算盘坠', price: 680, attack: 0, defense: 0, maxHp: 0, capacity: 8, reputation: 1, rarity: '优良', source: 'shop', passive: { tradeBonus: 0.04 }, text: '珠子一响，买卖双方都会重新算一遍。' },
  { id: 'surveyKit', slot: 'trinket', name: '测绘筒', price: 720, attack: 0, defense: 1, maxHp: 0, capacity: 6, reputation: 1, rarity: '优良', source: 'shop', passive: { exploreDiscount: 0.07 }, text: '展开后能标出水源、背街和容易塌陷的旧路。' },
  { id: 'duelistRapier', slot: 'weapon', name: '决斗细剑', price: 820, attack: 16, defense: 2, maxHp: 0, capacity: 0, reputation: 1, rarity: '稀有', source: 'shop', passive: { socialBonus: 2 }, text: '王都社交场喜欢这种克制而危险的体面。' },
  { id: 'guildBanner', slot: 'trinket', name: '商会小旗', price: 940, attack: 0, defense: 1, maxHp: 0, capacity: 10, reputation: 2, rarity: '稀有', source: 'shop', passive: { commissionBonus: 0.08 }, text: '插在货车上，委托人会觉得你更像正规生意。' },
  { id: 'blackLedger', slot: 'trinket', name: '黑市暗账', price: 980, attack: 0, defense: 0, maxHp: 0, capacity: 4, reputation: 1, rarity: '史诗', source: 'loot', passive: { tradeBonus: 0.06, sellBonus: 0.05 }, text: '每一页都写着不该公开的收购价。' },
  { id: 'mistCompass', slot: 'trinket', name: '雾径罗盘', price: 1080, attack: 0, defense: 2, maxHp: 0, capacity: 8, reputation: 1, rarity: '史诗', source: 'loot', passive: { exploreDiscount: 0.12, eventLuck: 0.08 }, text: '指针不指北，只指向更有故事的岔路。' },
  { id: 'wolfhideHarness', slot: 'armor', name: '狼皮车甲', price: 1120, attack: 1, defense: 18, maxHp: 28, capacity: 6, reputation: 1, rarity: '史诗', source: 'loot', passive: { combatReduction: 0.08 }, text: '北境猎队给货车披上的护甲，皮革里还留着风雪味。' },
  { id: 'roseSignet', slot: 'trinket', name: '玫瑰密印', price: 1160, attack: 0, defense: 2, maxHp: 0, capacity: 4, reputation: 2, rarity: '史诗', source: 'loot', passive: { socialBonus: 4 }, text: '印泥里混着香料，适合签契约，也适合递私信。' },
  { id: 'deepPick', slot: 'weapon', name: '深矿破镐', price: 1260, attack: 24, defense: 3, maxHp: 4, capacity: 4, reputation: 1, rarity: '史诗', source: 'loot', passive: { goodTypeBonus: '矿物' }, text: '镐尖敲过黑岩，也敲开过盗匪的护甲。' },
  { id: 'skyQuill', slot: 'trinket', name: '浮空羽笔', price: 1300, attack: 0, defense: 1, maxHp: 0, capacity: 6, reputation: 2, rarity: '史诗', source: 'loot', passive: { rumorBonus: 1, socialBonus: 2 }, text: '不用蘸墨也能写下明日可能发生的事。' },
  { id: 'sunfireMail', slot: 'armor', name: '日焰链甲', price: 1540, attack: 4, defense: 27, maxHp: 34, capacity: 0, reputation: 2, rarity: '传说', source: 'loot', passive: { combatReduction: 0.12 }, text: '链环在黄昏时会泛起火色，像把一段日光穿在身上。' },
  { id: 'voidKnife', slot: 'weapon', name: '无光匕首', price: 1580, attack: 29, defense: 1, maxHp: 0, capacity: 2, reputation: 2, rarity: '传说', source: 'loot', passive: { eventLuck: 0.1 }, text: '刀刃贴近灯火时，灯火会先退一步。' },
  { id: 'oathCrown', slot: 'trinket', name: '誓约冠饰', price: 1760, attack: 2, defense: 4, maxHp: 16, capacity: 8, reputation: 4, rarity: '传说', source: 'loot', passive: { socialBonus: 5, commissionBonus: 0.12 }, text: '古代商王戴过的冠饰，适合在众人面前许诺。' },
]

const ENEMIES = [
  { name: '路匪斥候', minRisk: 1, hp: 34, attack: 9, defense: 2, gold: 42, rep: 1 },
  { name: '荒原盗团', minRisk: 2, hp: 52, attack: 13, defense: 4, gold: 76, rep: 1 },
  { name: '王都契约刺客', minRisk: 2, hp: 48, attack: 14, defense: 5, gold: 92, rep: 1, locations: ['capital'] },
  { name: '港口走私水手', minRisk: 2, hp: 56, attack: 12, defense: 4, gold: 88, rep: 1, locations: ['port'] },
  { name: '矿坑虫群', minRisk: 3, hp: 68, attack: 15, defense: 6, gold: 95, rep: 1, locations: ['mine', 'forge'] },
  { name: '月影迷踪兽', minRisk: 3, hp: 64, attack: 17, defense: 5, gold: 104, rep: 1, locations: ['forest'] },
  { name: '北境逃兵队', minRisk: 4, hp: 82, attack: 18, defense: 9, gold: 132, rep: 2, locations: ['fort'] },
  { name: '沙海咒刃客', minRisk: 4, hp: 82, attack: 19, defense: 8, gold: 140, rep: 2, locations: ['oasis'] },
  { name: '失控学院魔像', minRisk: 3, hp: 76, attack: 16, defense: 10, gold: 124, rep: 2, locations: ['academy'] },
  { name: '古龙遗迹守卫', minRisk: 5, hp: 108, attack: 24, defense: 11, gold: 230, rep: 3, locations: ['ruins'] },
]

const ACHIEVEMENTS = [
  { id: 'firstTrade', name: '第一笔差价', text: '完成一次买入或卖出。', test: (s) => s.stats.trades >= 1 },
  { id: 'busyHands', name: '手不停账', text: '完成 25 次交易。', test: (s) => s.stats.trades >= 25 },
  { id: 'traveler', name: '驿路熟客', text: '旅行 10 次。', test: (s) => s.stats.travels >= 10 },
  { id: 'roadMaster', name: '大陆路线图', text: '旅行 25 次。', test: (s) => s.stats.travels >= 25 },
  { id: 'fighter', name: '带刀商人', text: '赢得 3 场战斗。', test: (s) => s.stats.battlesWon >= 3 },
  { id: 'veteran', name: '商路老兵', text: '赢得 8 场战斗。', test: (s) => s.stats.battlesWon >= 8 },
  { id: 'merchant', name: '千金行商', text: '金币达到 1000。', test: (s) => s.stats.maxGold >= 1000 },
  { id: 'magnate', name: '白塔巨贾', text: '金币达到 3000。', test: (s) => s.stats.maxGold >= 3000 },
  { id: 'treasury', name: '移动金库', text: '金币达到 6000。', test: (s) => s.stats.maxGold >= 6000 },
  { id: 'collector', name: '货样收藏家', text: '同时持有 8 种商品。', test: (s) => Object.values(s.inventory).filter(Boolean).length >= 8 },
  { id: 'warehouse', name: '满载而归', text: '货舱使用达到 40。', test: (s) => getCargoUsed(s) >= 40 },
  { id: 'armed', name: '全副武装', text: '三个装备栏都有装备。', test: (s) => Boolean(s.equipped.weapon && s.equipped.armor && s.equipped.trinket) },
  { id: 'wellPrepared', name: '稳健车队', text: '生命上限达到 130。', test: (s) => getTotals(s).maxHp >= 130 },
  { id: 'famous', name: '声名远扬', text: '声望达到 12。', test: (s) => s.reputation >= 12 },
  { id: 'connected', name: '各地都有熟人', text: '触发 15 次随机事件。', test: (s) => s.stats.events >= 15 },
  { id: 'profiteer', name: '算盘响亮', text: '累计净收入达到 2000。', test: (s) => s.stats.profit >= 2000 },
  { id: 'longRun', name: '三十日商路', text: '坚持到第 30 天。', test: (s) => s.day >= 30 },
  { id: 'firstBond', name: '第一次心动', text: '结识第一位人物。', test: (s) => (s.knownNpcIds?.length ?? 0) >= 1 },
  { id: 'warmHeart', name: '暧昧升温', text: '任意人物好感达到 50。', test: (s) => Object.values(s.relationships ?? {}).some((rel) => rel.affection >= 50) },
  { id: 'confession', name: '烛光表白', text: '完成一次表白。', test: (s) => Object.values(s.relationships ?? {}).some((rel) => rel.confessed) },
  { id: 'firstMarriage', name: '共同商路', text: '与一位人物结婚。', test: (s) => (s.partners?.length ?? 0) >= 1 },
  { id: 'manyLoves', name: '满车情书', text: '拥有三位伴侣。', test: (s) => (s.partners?.length ?? 0) >= 3 },
  { id: 'dates', name: '十次私约', text: '累计相处 10 次。', test: (s) => s.stats.dates >= 10 },
  { id: 'giftGiver', name: '礼物攻势', text: '送出 20 份礼物。', test: (s) => s.stats.gifts >= 20 },
  { id: 'explorer', name: '本地熟路', text: '探索 12 次。', test: (s) => (s.stats.explores ?? 0) >= 12 },
  { id: 'deepExplorer', name: '险地常客', text: '探索 35 次。', test: (s) => (s.stats.explores ?? 0) >= 35 },
  { id: 'rareHunter', name: '稀世战利品', text: '获得 5 件史诗或传说装备。', test: (s) => (s.stats.rareLoot ?? 0) >= 5 },
  { id: 'firstLandmark', name: '第一次揭开地图', text: '发现 1 处地点秘闻。', test: (s) => (s.stats.landmarksFound ?? 0) >= 1 },
  { id: 'landmarkAtlas', name: '秘闻地图册', text: '发现 12 处地点秘闻。', test: (s) => (s.stats.landmarksFound ?? 0) >= 12 },
  { id: 'factionFriend', name: '商会座上宾', text: '任意势力好感达到 8。', test: (s) => Object.values(s.factions ?? {}).some((value) => value >= 8) },
  { id: 'alliedNetwork', name: '大陆人脉网', text: '4 个势力好感达到 5。', test: (s) => Object.values(s.factions ?? {}).filter((value) => value >= 5).length >= 4 },
  { id: 'extremeRoad', name: '极危归来', text: '从极危地点或路线中胜出 3 次。', test: (s) => (s.stats.extremeSurvivals ?? 0) >= 3 },
  { id: 'companionRoad', name: '同行默契', text: '邀请人物协助 8 次。', test: (s) => (s.stats.companionHelps ?? 0) >= 8 },
  { id: 'commissioner', name: '委托熟手', text: '完成 10 个本地委托。', test: (s) => (s.stats.commissionsDone ?? 0) >= 10 },
  { id: 'routeContractor', name: '第一张跨城商单', text: '完成 1 个跨城商单。', test: (s) => (s.stats.routeContractsDone ?? 0) >= 1 },
  { id: 'routeNetworker', name: '商路承运人', text: '完成 6 个跨城商单。', test: (s) => (s.stats.routeContractsDone ?? 0) >= 6 },
  { id: 'guildRising', name: '小商会成形', text: '商会等级达到 3。', test: (s) => (s.guild?.level ?? 1) >= 3 },
  { id: 'guildHouse', name: '自立商号', text: '商会等级达到 6。', test: (s) => (s.guild?.level ?? 1) >= 6 },
  { id: 'localExpert', name: '地方通', text: '任一地点熟练度达到 4 级。', test: (s) => LOCATIONS.some((location) => getMasteryLevel(s, location.id) >= 4) },
  { id: 'pressureRelief', name: '稳住车队', text: '累计清除 20 点风险压力。', test: (s) => (s.stats.pressureCleared ?? 0) >= 20 },
  { id: 'personalQuests', name: '并肩办事', text: '完成人物共同任务 8 次。', test: (s) => (s.stats.npcQuests ?? 0) >= 8 },
]

const START_LOG = [
  '你带着一辆旧货车抵达白塔王都，目标是在大陆各地赚出自己的商会。',
  '提示：不同地点对同一商品的估值差异很大，旅行越危险，事件越刺激。',
]

const START_BACKGROUNDS = [
  { id: 'noble', name: '旧贵族介绍信', text: '白塔旧姓替你写过一封推荐信。', gold: 20, maxHp: 0, attack: 0, defense: 0, capacity: 0, reputation: 2 },
  { id: 'miner', name: '矿镇熟人', text: '灰烬矿镇的工头欠你一顿酒。', gold: 0, maxHp: 8, attack: 1, defense: 1, capacity: 2, reputation: 0 },
  { id: 'guide', name: '沙海向导', text: '你熟悉沙丘里的水井和盗匪暗号。', gold: 35, maxHp: 0, attack: 1, defense: 0, capacity: 4, reputation: 1 },
  { id: 'student', name: '学院旁听生', text: '你听过几堂炼金课，知道哪些材料会被抢购。', gold: -10, maxHp: 0, attack: 0, defense: 0, capacity: 2, reputation: 1 },
  { id: 'guard', name: '退役护卫', text: '你曾跟随商队过境，刀口和账本都不陌生。', gold: -20, maxHp: 12, attack: 2, defense: 2, capacity: 0, reputation: 0 },
]

const NPCS = [
  {
    id: 'lina',
    name: '莉娜',
    role: '市集港拍卖师',
    location: 'port',
    likes: ['pearl', 'silk', 'wine'],
    bonus: { reputation: 1 },
    text: '她说话像落槌一样利落，笑起来却故意拖慢半拍。',
    cooperate: '莉娜替你放出一条拍卖消息，下一笔大买卖更容易抬价。',
    lines: {
      talk: ['莉娜把竞拍牌抵在唇边，问你愿不愿意把真心也拿出来叫价。', '她靠在拍卖台边听你讲商路，眼神像在估算一件稀世拍品。'],
      date: ['她带你穿过收市后的港口，空拍卖厅只剩回声和两个人越来越近的呼吸。', '烛火熄到最后一截，她笑着说今晚不落槌，只等你先开价。'],
      intimate: ['她把账册合上，指尖慢慢划过你的袖口；窗外潮声盖住低语，清晨只剩未写进账本的余温。'],
      giftGood: '莉娜把礼物贴近胸前，故意问你这是交易，还是别有用心。',
      giftNormal: '莉娜收下礼物，笑着说这笔人情以后要加倍清算。',
      confess: '莉娜没有立刻回答，只把你拉到帘幕后亲了很久，像宣布一场只有两人的成交。',
      marry: '莉娜与你交换商会戒印，婚宴后拍卖厅熄了灯，她把最高价留给了漫长夜色。',
      partner: ['莉娜替你压住一个恶意抬价的买家，转身时悄悄扣住你的手腕。'],
    },
  },
  {
    id: 'kael',
    name: '凯尔',
    role: '北境护卫',
    location: 'fort',
    likes: ['salt', 'candle', 'dragonbone'],
    bonus: { defense: 2, maxHp: 8 },
    text: '他习惯站在你身后半步，像一堵沉默而可靠的墙。',
    cooperate: '凯尔检查了车队护具，你恢复生命并提升防备。',
    lines: {
      talk: ['凯尔话不多，只把热酒推到你手边，掌心停在杯沿旁等你碰上去。', '他替你系紧披风，动作克制，目光却停得比风雪更久。'],
      date: ['守夜的篝火旁，凯尔让你靠在他的肩上，整夜没有松开披风下的手。', '他带你登上要塞高墙，雪落得很静，沉默里藏着比誓言更烫的东西。'],
      intimate: ['帐帘落下后，他仍旧克制地问你冷不冷；后来火光低下去，只剩盔甲卸落的轻响和清晨替你盖好的毯子。'],
      giftGood: '凯尔郑重收下礼物，像收下一枚必须守护的军令。',
      giftNormal: '凯尔点头道谢，把礼物放进贴身行囊。',
      confess: '凯尔听完表白后沉默很久，最后低头吻你的额角，说以后每一条路他都守着你。',
      marry: '凯尔与你在要塞火盆前立誓。那晚他卸下所有防备，只把温度留给你。',
      partner: ['凯尔替你挡下一场夜袭，天亮后只说守住你比守城更重要。'],
    },
  },
  {
    id: 'mira',
    name: '米拉',
    role: '浮空学院学者',
    location: 'academy',
    likes: ['scroll', 'ink', 'map'],
    bonus: { capacity: 4, reputation: 1 },
    text: '她会把行情写成公式，也会在烛光下认真看你的眼睛。',
    cooperate: '米拉整理了明日风向，商路传闻变得更清晰。',
    lines: {
      talk: ['米拉一边演算价格，一边偷偷把你的名字写进页边批注。', '她说亲近也是变量，然后红着脸要求你不要笑。'],
      date: ['学院钟声停后，她把你留在观星室，星图铺满桌面，距离比公式更难保持。', '她用羽毛笔点着你的指节，说今晚的实验需要一点勇气和很多信任。'],
      intimate: ['星盘缓缓转动，她终于放下笔记；墨水洇开一小片，床帘后的低声讨论到清晨才结束。'],
      giftGood: '米拉抱着礼物眼睛发亮，立刻把它登记为“与你有关的重要样本”。',
      giftNormal: '米拉认真记录礼物来源，最后小声说她更喜欢你解释它的样子。',
      confess: '米拉试图分析这段感情，最后公式写乱，只好用一个笨拙又真诚的吻承认答案。',
      marry: '米拉把婚约写成双人研究计划。夜里星图被推到一边，新的注释只留在彼此心里。',
      partner: ['米拉提前推算出一条涨价传闻，还在纸角画了一个很小的心。'],
    },
  },
  {
    id: 'selene',
    name: '塞琳',
    role: '月影药师',
    location: 'forest',
    likes: ['herb', 'moon', 'amber'],
    bonus: { maxHp: 12 },
    text: '她的指尖总带着草木香，靠近时让人很难保持距离。',
    cooperate: '塞琳替你调配药剂，生命恢复不少。',
    lines: {
      talk: ['塞琳替你检查旧伤，指尖温柔得像故意放慢的咒语。', '她把药香吹散在你颈侧，轻声提醒你别乱动。'],
      date: ['月影森林的夜露很凉，她却把披肩分给你一半，草木香在近处慢慢变甜。', '她带你泡进温泉边的药雾里，谈话被水声切得很碎，心跳却清楚。'],
      intimate: ['药灯一盏盏暗下去，她替你解开沾尘的外衣；夜色像柔软绷带，清晨只剩草木香和被熨平的疲惫。'],
      giftGood: '塞琳把礼物捧在掌心，笑意像新煎好的蜜药一样柔软。',
      giftNormal: '塞琳收下礼物，温柔地说心意本身也能入药。',
      confess: '塞琳听完后靠近你，把答案藏进一个带着药草香的吻里。',
      marry: '塞琳与你在月树下结誓。那晚药灯很暖，她把所有温柔都留给你慢慢醒来。',
      partner: ['塞琳在路上替你换药，指尖停留得久了一点，伤口和心情都好了许多。'],
    },
  },
  {
    id: 'oran',
    name: '奥兰',
    role: '灰烬工匠',
    location: 'forge',
    likes: ['ore', 'mithril', 'gear'],
    bonus: { attack: 1, defense: 1, capacity: 3 },
    text: '他嘴硬，手却很稳，修车时会把外衣披到你肩上。',
    cooperate: '奥兰加固了货车底盘，货舱更耐折腾。',
    lines: {
      talk: ['奥兰嘴上嫌你挡路，却把最暖的位置留在炉边。', '他替你擦掉脸上的煤灰，动作粗鲁，指腹却小心。'],
      date: ['工坊收火后，他带你坐在冷却的铁砧旁，沉默里满是没说出口的靠近。', '他把外衣扔给你，说夜里冷，耳尖却比炉火还红。'],
      intimate: ['炉火熄到暗红，他终于不再嘴硬；衣扣松开的声音混进铁链轻响，清晨你的披风被他认真叠好。'],
      giftGood: '奥兰接过礼物哼了一声，转头就把它放进最珍贵的工具箱。',
      giftNormal: '奥兰说这东西还行，却悄悄把它收得很稳。',
      confess: '奥兰听完表白后低声骂自己迟钝，然后用一个笨拙又用力的拥抱回答你。',
      marry: '奥兰亲手打了一对戒环。婚夜工坊门闩落下，炉灰里只剩慢慢亮起的余温。',
      partner: ['奥兰连夜修好货车，还把自己的外衣披到你肩上。'],
    },
  },
  {
    id: 'naya',
    name: '娜雅',
    role: '沙海密探',
    location: 'oasis',
    likes: ['spice', 'silk', 'map'],
    bonus: { attack: 2 },
    text: '她总在你耳边说话，声音压得很低，像秘密也像邀请。',
    cooperate: '娜雅递来一张暗线名单，路上的麻烦少了些。',
    lines: {
      talk: ['娜雅把情报说到一半，忽然贴近你耳侧，问你想听消息还是想听真话。', '她用面纱遮住笑意，只把眼神留给你猜。'],
      date: ['沙海夜市灯影摇晃，她牵你绕进无人帐后，说秘密总要用更近的距离交换。', '她把匕首和假身份都放到一边，难得让你看见不设防的笑。'],
      intimate: ['帐外风沙盖住脚步声，她把灯芯压暗，指尖停在你的腕上；等天亮时，只有一张新的情报纸留在枕边。'],
      giftGood: '娜雅收下礼物，低笑着说你越来越懂她的暗号。',
      giftNormal: '娜雅掂了掂礼物，说这份心意还算值得保密。',
      confess: '娜雅没有说答应，只把你拉进阴影里，吻得像封住一份危险情报。',
      marry: '娜雅与你在沙丘背风处立下私约。那晚帐灯很低，所有假名都被她亲手摘下。',
      partner: ['娜雅替你处理掉一个跟踪者，回来时只说今晚想待在你身边。'],
    },
  },
  {
    id: 'avel',
    name: '阿维尔',
    role: '王都贵族',
    location: 'capital',
    likes: ['wine', 'relic', 'candle'],
    bonus: { reputation: 2 },
    text: '他的礼节无可挑剔，但靠近时总带一点越界的试探。',
    cooperate: '阿维尔替你写了一封邀请函，声望提高。',
    lines: {
      talk: ['阿维尔吻过你的手背，礼貌得体，却故意停留得不合礼数。', '他在舞会边缘与你低声谈价，句句像交易，也句句像邀约。'],
      date: ['王都花厅的门合上后，他终于松开领扣，笑问你是否还要保持商人的冷静。', '他带你避开宴会耳目，月光把规矩照得很薄。'],
      intimate: ['丝帘垂落，礼仪书被随手合上；清晨侍从只看见烛台燃尽，而你们把昨夜留成不能公开的秘密。'],
      giftGood: '阿维尔收下礼物，称赞你的眼光和胆量一样动人。',
      giftNormal: '阿维尔微笑道谢，说礼物不必昂贵，送礼的人才值得品评。',
      confess: '阿维尔以贵族礼节向你致意，随后越过所有礼节吻住你。',
      marry: '阿维尔为你安排了一场体面的婚约。等宾客散尽，他亲手解下象征身份的绶带交给你。',
      partner: ['阿维尔替你挡下税务盘问，随后在无人处索要一个“谢礼”。'],
    },
  },
  {
    id: 'rhea',
    name: '蕾娅',
    role: '遗迹猎人',
    location: 'ruins',
    likes: ['relic', 'dragonbone', 'map'],
    bonus: { attack: 1, maxHp: 6 },
    text: '她把危险讲得像情话，指节擦过地图时会故意碰到你。',
    cooperate: '蕾娅标出一条遗迹捷径，你得到一件稀有样品。',
    lines: {
      talk: ['蕾娅把匕首插在地图边，笑着问你敢不敢跟她赌一段更刺激的路。', '她讲起陷阱时眼睛发亮，看你的眼神比火把还直接。'],
      date: ['遗迹穹顶下只剩回声，她把你拉到石柱背后，说危险之后的拥抱最诚实。', '她带你看龙骨上的星光，靠近时毫不掩饰自己的心跳。'],
      intimate: ['探险灯一盏盏熄灭，她把地图压在背包下；夜里的遗迹很安静，只记得两个人贴近取暖的影子。'],
      giftGood: '蕾娅收下礼物，兴奋地亲了亲你的脸侧，说你越来越像她的同伙。',
      giftNormal: '蕾娅把礼物抛起接住，说这份胆量比货物更有趣。',
      confess: '蕾娅听完就笑了，直接把你拽近，说她早就在等你开口。',
      marry: '蕾娅把婚誓刻在一片旧龙骨上。那晚你们在遗迹深处过夜，火光把影子拉得很近。',
      partner: ['蕾娅从遗迹带回一件小样品，眨眼说这是给伴侣的战利品。'],
    },
  },
]

const STARTER_GOODS = ['grain', 'herb', 'spice', 'salt', 'ink', 'ore', 'silk', 'amber', 'candle']

const FACTIONS = [
  { id: 'whiteGuild', name: '白塔商会', locationId: 'capital', text: '王都的契约、税卡和贵族订单都绕不开他们。' },
  { id: 'harborAuction', name: '港口拍卖行', locationId: 'port', text: '拍卖师与远洋货仓共同决定港口货价。' },
  { id: 'emberUnion', name: '灰烬工匠联盟', locationId: 'mine', text: '矿镇和赤铜工坊的炉火背后是同一批工匠。' },
  { id: 'moonCircle', name: '月影药师会', locationId: 'forest', text: '药师、精灵酒商和森林向导共享密林情报。' },
  { id: 'northQuarter', name: '北境军需处', locationId: 'fort', text: '他们用军令收货，也用军饷抬价。' },
  { id: 'sandVeil', name: '沙海密探网', locationId: 'oasis', text: '绿洲里的每一顶帐篷都可能藏着消息。' },
  { id: 'skyFaculty', name: '浮空学院导师团', locationId: 'academy', text: '导师们会为样本、卷轴和法器开出危险高价。' },
  { id: 'dragonLeague', name: '古龙遗迹猎盟', locationId: 'ruins', text: '他们不怕危险，只怕错过真正的遗物。' },
]

const LOCATION_TRAITS = {
  capital: { factionId: 'whiteGuild', slots: { trinket: 1.18 }, source: { loot: 1.08 }, localGoods: ['silk', 'wine', 'candle'], equipmentHint: '王都贵族愿意为饰品、徽记和体面装备多付钱。' },
  port: { factionId: 'harborAuction', slots: { weapon: 1.08, trinket: 1.12 }, source: { loot: 1.1 }, localGoods: ['pearl', 'spice', 'wine'], equipmentHint: '港口拍卖行喜欢稀奇来历，掉落装备容易拍出好价。' },
  mine: { factionId: 'emberUnion', slots: { weapon: 1.16, armor: 1.14 }, source: { shop: 1.04 }, localGoods: ['ore', 'mithril', 'gear'], equipmentHint: '矿镇收武器防具最爽快，尤其是能扛矿坑事故的硬货。' },
  forest: { factionId: 'moonCircle', slots: { armor: 1.1, trinket: 1.14 }, source: { loot: 1.08 }, localGoods: ['herb', 'moon', 'wine', 'amber'], equipmentHint: '月影森林偏爱轻便、防护和带有魔法气息的装备。' },
  fort: { factionId: 'northQuarter', slots: { weapon: 1.22, armor: 1.2 }, source: { shop: 1.06 }, localGoods: ['salt', 'grain', 'candle'], equipmentHint: '要塞军需处高价收武器和护甲，越结实越容易成交。' },
  oasis: { factionId: 'sandVeil', slots: { weapon: 1.12, trinket: 1.1 }, source: { loot: 1.12 }, localGoods: ['spice', 'silk', 'map'], equipmentHint: '沙海黑市喜欢隐秘、轻巧和来历不明的装备。' },
  academy: { factionId: 'skyFaculty', slots: { trinket: 1.24 }, source: { loot: 1.16 }, localGoods: ['crystal', 'scroll', 'ink', 'map'], equipmentHint: '学院导师愿意为饰品、法器和遗迹样本支付研究经费。' },
  ruins: { factionId: 'dragonLeague', slots: { weapon: 1.14, trinket: 1.2 }, source: { loot: 1.28 }, localGoods: ['relic', 'dragonbone', 'map'], equipmentHint: '遗迹猎盟不问来路，只看装备是否真带着古龙气息。' },
  forge: { factionId: 'emberUnion', slots: { weapon: 1.2, armor: 1.16 }, source: { shop: 1.08, loot: 1.08 }, localGoods: ['gear', 'ore', 'mithril'], equipmentHint: '赤铜工坊会拆解、重铸装备，因此武器防具都能卖出稳定价格。' },
}

const LANDMARKS = [
  { id: 'capital-oath-vault', locationId: 'capital', name: '旧誓约银库', text: '你在白塔地下账库找到一排被封存的旧契约，银库管理员愿意为清点结果付费。', rewards: [{ type: 'gold', amount: 120 }] },
  { id: 'capital-rose-court', locationId: 'capital', name: '玫瑰后庭', text: '贵族后庭的花匠认出你的商印，把几份宴会采购消息悄悄递给你。', rewards: [{ type: 'good', goodId: 'wine', amount: 1 }, { type: 'good', goodId: 'candle', amount: 1 }] },
  { id: 'port-tide-locker', locationId: 'port', name: '潮汐寄货柜', text: '退潮时露出的寄货柜里还压着几枚防水封蜡，港口拍卖行愿意接手。', rewards: [{ type: 'good', goodId: 'pearl', amount: 1 }, { type: 'gold', amount: 70 }] },
  { id: 'port-salt-bell', locationId: 'port', name: '盐钟码头', text: '老水手教你分辨盐钟响声，哪艘船缺钱急售从此更容易听出来。', rewards: [{ type: 'good', goodId: 'spice', amount: 2 }] },
  { id: 'mine-black-rail', locationId: 'mine', name: '黑岩旧轨', text: '废弃矿轨尽头还有未登记的矿样，工头让你先挑走一箱。', rewards: [{ type: 'good', goodId: 'ore', amount: 2 }, { type: 'good', goodId: 'gear', amount: 1 }] },
  { id: 'mine-ember-shrine', locationId: 'mine', name: '炉灰小祠', text: '矿工在炉灰小祠给你的车轮系上红绳，顺手塞来一块发亮矿锭。', rewards: [{ type: 'good', goodId: 'mithril', amount: 1 }] },
  { id: 'forest-moonwell', locationId: 'forest', name: '月井浅岸', text: '月井浅岸浮着银色水雾，塞满空瓶后药师会的人对你更客气。', rewards: [{ type: 'good', goodId: 'moon', amount: 1 }, { type: 'good', goodId: 'herb', amount: 2 }] },
  { id: 'forest-honey-grove', locationId: 'forest', name: '琥珀蜂林', text: '蜂林守看见你没有惊扰蜂群，送来一罐能在旅店卖出好价的琥珀蜜。', rewards: [{ type: 'good', goodId: 'amber', amount: 2 }] },
  { id: 'fort-signal-tower', locationId: 'fort', name: '烽火旧塔', text: '旧塔旗绳还没断，你替军需官校准旗号，换来一笔边境津贴。', rewards: [{ type: 'gold', amount: 150 }] },
  { id: 'fort-frost-cellar', locationId: 'fort', name: '霜盐地窖', text: '地窖冷得刺骨，但霜盐保存完好，守军让你带走几袋样品。', rewards: [{ type: 'good', goodId: 'salt', amount: 3 }] },
  { id: 'oasis-mirror-well', locationId: 'oasis', name: '镜沙水井', text: '井壁倒映出一条少有人走的商路，密探用星图残页换走你的沉默。', rewards: [{ type: 'good', goodId: 'map', amount: 1 }] },
  { id: 'oasis-blue-tent', locationId: 'oasis', name: '蓝帘暗帐', text: '蓝帘后的账房认得真正的行商，给你两包不会登记在税册上的香料。', rewards: [{ type: 'good', goodId: 'spice', amount: 2 }] },
  { id: 'academy-orbit-room', locationId: 'academy', name: '环星演算室', text: '学院旧演算室的星盘还在转动，导师愿意用水晶换取你的观测记录。', rewards: [{ type: 'good', goodId: 'crystal', amount: 1 }, { type: 'gold', amount: 80 }] },
  { id: 'academy-ink-archive', locationId: 'academy', name: '夜鸦墨库', text: '你帮书记员找回错架卷轴，墨库按规矩付了一份安静的谢礼。', rewards: [{ type: 'good', goodId: 'ink', amount: 2 }, { type: 'good', goodId: 'scroll', amount: 1 }] },
  { id: 'ruins-dragon-door', locationId: 'ruins', name: '古龙断门', text: '断门后的石匣没有机关，只有猎盟找了很久的一片龙骨拓片。', rewards: [{ type: 'good', goodId: 'dragonbone', amount: 1 }, { type: 'good', goodId: 'relic', amount: 1 }] },
  { id: 'ruins-star-nest', locationId: 'ruins', name: '星巢裂隙', text: '裂隙里散着远古商队的补给，你在塌方前抢出一包珍贵样品。', rewards: [{ type: 'good', goodId: 'map', amount: 1 }, { type: 'gold', amount: 110 }] },
  { id: 'forge-copper-lift', locationId: 'forge', name: '赤铜升降机', text: '你让卡死的升降机重新动起来，工匠们用机关件和工钱表达感谢。', rewards: [{ type: 'good', goodId: 'gear', amount: 2 }, { type: 'gold', amount: 95 }] },
  { id: 'forge-temper-room', locationId: 'forge', name: '淬火暗室', text: '暗室里还留着一套旧淬火配方，赤铜工坊愿意用成品样件交换。', rewards: [{ type: 'equipment', itemId: 'routeBoots' }] },
]

const landmarksByLocation = LANDMARKS.reduce((map, landmark) => {
  map[landmark.locationId] = [...(map[landmark.locationId] ?? []), landmark]
  return map
}, {})

const rand = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min
const pick = (items) => items[Math.floor(Math.random() * items.length)]
const clamp = (value, min, max) => Math.max(min, Math.min(max, value))

const goodsById = Object.fromEntries(GOODS.map((item) => [item.id, item]))
const locationsById = Object.fromEntries(LOCATIONS.map((item) => [item.id, item]))
const equipmentById = Object.fromEntries(EQUIPMENT.map((item) => [item.id, item]))
const npcById = Object.fromEntries(NPCS.map((item) => [item.id, item]))
const rarityRank = { 普通: 1, 优良: 2, 稀有: 3, 史诗: 4, 传说: 5 }
const routeLabels = { trade: '跑商', explore: '探险', combat: '战斗', social: '社交' }
const commissionLabels = { delivery: '交货', survey: '勘探', bounty: '悬赏', social: '拜访' }
const FACTION_FAVOR_TIERS = [
  { min: 9, name: '座上商号', text: '本地势力愿意替你压价、加赏并回收好装备。' },
  { min: 5, name: '可信跑商', text: '委托报酬提高，进出本地时更容易拿到照应。' },
  { min: 2, name: '照面熟客', text: '买卖谈价略有余地，市面小麻烦也有人通风报信。' },
]

const COMMISSION_TEXT = {
  delivery: ['急需补货', '临时采购', '补给缺口', '账房点名要货'],
  survey: ['勘察暗巷', '清点旧路', '调查仓库', '探查传闻'],
  bounty: ['清理威胁', '护送短程', '追查盗匪', '夺回失货'],
  social: ['递送私信', '宴席引荐', '学术拜访', '密谈牵线'],
}

const ROUTE_CONTRACT_TEXT = [
  '封蜡急单',
  '整车承运',
  '行会调货',
  '贵客预订',
  '压舱补缺',
  '节庆备采',
]

const ROUTE_CONDITIONS = [
  { id: 'clear', name: '晴稳商路', weight: 18, travelCost: 0.92, exploreCost: 0.96, danger: -0.03, pressure: -1, text: '驿站补给充足，车辙干爽，适合赶路和压低消耗。' },
  { id: 'drizzle', name: '细雨泥路', weight: 13, travelCost: 1.1, exploreCost: 1.08, danger: 0.035, pressure: 1, text: '雨水让车轮陷进泥里，旧路和暗巷都更难处理。' },
  { id: 'crowded', name: '赶集拥路', weight: 12, travelCost: 1.05, exploreCost: 0.98, danger: -0.02, pressure: 0, text: '商队和摊贩挤满驿道，慢一些，但人多也压住了盗匪。' },
  { id: 'patrol', name: '巡防严密', weight: 10, travelCost: 0.98, exploreCost: 1.02, danger: -0.06, pressure: -2, text: '巡防队清过路障，战斗风险下降，但私下探索会被盘问。' },
  { id: 'shortage', name: '补给紧张', weight: 8, travelCost: 1.15, exploreCost: 1.12, danger: 0.025, pressure: 2, text: '水袋、饲料和修车材料都涨了价，车队压力更容易堆高。' },
  { id: 'omens', name: '异兆浮现', weight: 6, travelCost: 1, exploreCost: 0.9, danger: 0.055, pressure: 1, text: '星象和旧传闻把冒险者引向偏路，线索更多，危险也更近。' },
]
const routeConditionById = Object.fromEntries(ROUTE_CONDITIONS.map((item) => [item.id, item]))

const LOCAL_SCENE_TEMPLATES = {
  capital: [
    { id: 'court-banquet', name: '宫宴备采', goodIds: ['silk', 'wine', 'candle'], factor: 1.22, pressure: -1, text: '贵族管家临时加单，体面货物更容易谈出高价。' },
    { id: 'seal-audit', name: '契印复核', goodIds: ['grain', 'scroll', 'ink'], factor: 0.84, pressure: 1, text: '税务厅抽查契印，账面货物短暂压价，车队也更紧张。' },
  ],
  port: [
    { id: 'low-tide', name: '退潮清仓', goodIds: ['pearl', 'spice', 'amber'], factor: 0.78, pressure: 0, text: '潮水退得早，船仓急着腾位，本地货源一时变多。' },
    { id: 'captain-feast', name: '船长宴席', goodIds: ['wine', 'silk', 'candle'], factor: 1.2, pressure: -1, text: '远洋船长包下酒馆，奢侈货和礼仪用品都被抬价。' },
  ],
  mine: [
    { id: 'deep-vein', name: '深脉开采', goodIds: ['ore', 'mithril', 'gear'], factor: 0.8, pressure: 1, text: '新矿脉刚被打通，矿样涌出，但井下事故也让车队绷紧神经。' },
    { id: 'shift-strike', name: '换班停炉', goodIds: ['grain', 'herb', 'candle'], factor: 1.24, pressure: 2, text: '矿工换班和停炉检修撞在一起，补给品被一抢而空。' },
  ],
  forest: [
    { id: 'moon-bloom', name: '月花盛开', goodIds: ['herb', 'moon', 'amber'], factor: 0.76, pressure: -1, text: '月花开满林地，药师会愿意低价放出新鲜采集物。' },
    { id: 'mist-market', name: '雾中集市', goodIds: ['wine', 'silk', 'scroll'], factor: 1.18, pressure: 1, text: '精灵集市只开半日，稀奇客人把外来货物买得很快。' },
  ],
  fort: [
    { id: 'front-list', name: '前线清单', goodIds: ['grain', 'candle', 'spice'], factor: 1.28, pressure: 2, text: '军需官贴出追加清单，民生和慰问货物立刻紧俏。' },
    { id: 'salt-caravan', name: '霜盐车队', goodIds: ['salt', 'ore', 'gear'], factor: 0.82, pressure: -1, text: '北境盐车安全抵达，要塞市场短暂安稳下来。' },
  ],
  oasis: [
    { id: 'blue-tent', name: '蓝帐密市', goodIds: ['spice', 'silk', 'map'], factor: 0.78, pressure: 1, text: '蓝帐后的密市开门，便宜是真便宜，盯梢也是真多。' },
    { id: 'mirror-route', name: '镜井占路', goodIds: ['pearl', 'moon', 'map'], factor: 1.22, pressure: -1, text: '镜井水面映出新路线，密探们愿意为稀有线索加价。' },
  ],
  academy: [
    { id: 'exam-week', name: '炼金考周', goodIds: ['crystal', 'scroll', 'ink'], factor: 1.25, pressure: 0, text: '导师和学徒挤满材料窗，知识与魔法货物卖得飞快。' },
    { id: 'archive-dust', name: '旧档除尘', goodIds: ['scroll', 'ink', 'map'], factor: 0.82, pressure: -1, text: '学院清理旧档，重复卷轴和墨水被成捆放出。' },
  ],
  ruins: [
    { id: 'hunter-rush', name: '猎盟集结', goodIds: ['herb', 'grain', 'pearl'], factor: 1.3, pressure: 2, text: '遗迹猎人临时集结，补给和护身货物被扫得很空。' },
    { id: 'quiet-door', name: '石门静默', goodIds: ['relic', 'dragonbone', 'map'], factor: 0.86, pressure: -1, text: '旧石门今日罕见安静，猎人愿意把重复样本换成路费。' },
  ],
  forge: [
    { id: 'furnace-order', name: '炉群接单', goodIds: ['ore', 'mithril', 'crystal'], factor: 1.2, pressure: 1, text: '赤铜炉群同时接单，矿料和稳定法阵材料需求升温。' },
    { id: 'gear-overrun', name: '齿轮溢仓', goodIds: ['gear', 'candle', 'ore'], factor: 0.8, pressure: -1, text: '试制齿轮做多了，工匠把一批实用品压价处理。' },
  ],
}

function createEquipmentInstance(itemId) {
  return { uid: `${itemId}-${Date.now()}-${rand(1000, 9999)}`, itemId }
}

function getEquipmentItem(instanceOrId) {
  if (!instanceOrId) return null
  if (typeof instanceOrId === 'string') return equipmentById[instanceOrId] ?? null
  return equipmentById[instanceOrId.itemId] ?? null
}

function getEquippedItem(game, slot) {
  const uid = game.equipped?.[slot]
  const instance = (game.equipmentOwned ?? []).find((item) => item.uid === uid)
  return getEquipmentItem(instance)
}

function getEquipmentPassives(game) {
  return Object.values(game.equipped ?? {})
    .filter(Boolean)
    .map((uid) => (game.equipmentOwned ?? []).find((item) => item.uid === uid))
    .map(getEquipmentItem)
    .filter(Boolean)
    .reduce(
      (sum, item) => {
        const passive = item.passive ?? {}
        return {
          routeDiscount: sum.routeDiscount + (passive.routeDiscount ?? 0),
          exploreDiscount: sum.exploreDiscount + (passive.exploreDiscount ?? 0),
          combatReduction: sum.combatReduction + (passive.combatReduction ?? 0),
          tradeBonus: sum.tradeBonus + (passive.tradeBonus ?? 0),
          sellBonus: sum.sellBonus + (passive.sellBonus ?? 0),
          socialBonus: sum.socialBonus + (passive.socialBonus ?? 0),
          commissionBonus: sum.commissionBonus + (passive.commissionBonus ?? 0),
          eventLuck: sum.eventLuck + (passive.eventLuck ?? 0),
          rumorBonus: sum.rumorBonus + (passive.rumorBonus ?? 0),
          goodTypeBonus: passive.goodTypeBonus ?? sum.goodTypeBonus,
        }
      },
      { routeDiscount: 0, exploreDiscount: 0, combatReduction: 0, tradeBonus: 0, sellBonus: 0, socialBonus: 0, commissionBonus: 0, eventLuck: 0, rumorBonus: 0, goodTypeBonus: null },
    )
}

function normalizeEquipmentState(payload) {
  const rawOwned = Array.isArray(payload.equipmentOwned) ? payload.equipmentOwned : []
  const instances = rawOwned.map((item, index) => {
    if (typeof item === 'string') return { uid: `${item}-legacy-${index}`, itemId: item }
    return item?.uid && item?.itemId ? item : null
  }).filter((item) => item && equipmentById[item.itemId])

  const equipped = { weapon: null, armor: null, trinket: null }
  Object.entries(payload.equipped ?? {}).forEach(([slot, value]) => {
    if (!value) return
    const exact = instances.find((item) => item.uid === value)
    if (exact) {
      equipped[slot] = exact.uid
      return
    }
    const legacy = instances.find((item) => item.itemId === value && equipmentById[item.itemId]?.slot === slot)
    if (legacy) equipped[slot] = legacy.uid
  })

  return { equipmentOwned: instances, equipped }
}

function describeRarity(rarity) {
  return rarity ?? '普通'
}

function createInitialFactions() {
  return Object.fromEntries(FACTIONS.map((faction) => [faction.id, 0]))
}

function createInitialLocationMastery() {
  return Object.fromEntries(LOCATIONS.map((location) => [location.id, { trades: 0, explores: 0, battles: 0, social: 0 }]))
}

function normalizeLocationMastery(payload = {}) {
  const base = createInitialLocationMastery()
  Object.entries(payload ?? {}).forEach(([locationId, value]) => {
    if (!base[locationId]) return
    base[locationId] = { ...base[locationId], ...(value ?? {}) }
  })
  return base
}

function createInitialDiscoveries() {
  return Object.fromEntries(LOCATIONS.map((location) => [location.id, []]))
}

function normalizeDiscoveries(payload = {}) {
  const base = createInitialDiscoveries()
  Object.entries(payload ?? {}).forEach(([locationId, value]) => {
    if (!base[locationId] || !Array.isArray(value)) return
    const allowed = new Set((landmarksByLocation[locationId] ?? []).map((landmark) => landmark.id))
    base[locationId] = [...new Set(value.filter((id) => allowed.has(id)))]
  })
  return base
}

function getDiscoveredLandmarks(game, locationId = game.location) {
  const known = new Set(game.discoveries?.[locationId] ?? [])
  return (landmarksByLocation[locationId] ?? []).filter((landmark) => known.has(landmark.id))
}

function getUndiscoveredLandmarks(game, locationId = game.location) {
  const known = new Set(game.discoveries?.[locationId] ?? [])
  return (landmarksByLocation[locationId] ?? []).filter((landmark) => !known.has(landmark.id))
}

function createDiscoveryEvent(game, location) {
  const candidates = getUndiscoveredLandmarks(game, location.id)
  if (!candidates.length) return null
  const landmark = pick(candidates)
  return { kind: 'discovery', locationId: location.id, landmarkId: landmark.id }
}

function getMasteryScore(game, locationId = game.location) {
  const mastery = game.locationMastery?.[locationId] ?? {}
  return (mastery.trades ?? 0) + (mastery.explores ?? 0) * 2 + (mastery.battles ?? 0) * 2 + (mastery.social ?? 0)
}

function getMasteryLevel(game, locationId = game.location) {
  const score = getMasteryScore(game, locationId)
  if (score >= 42) return 4
  if (score >= 24) return 3
  if (score >= 10) return 2
  if (score >= 3) return 1
  return 0
}

function addLocationMastery(game, locationId, key, amount = 1) {
  const mastery = normalizeLocationMastery(game.locationMastery)
  mastery[locationId] = { ...mastery[locationId], [key]: (mastery[locationId]?.[key] ?? 0) + amount }
  return { ...game, locationMastery: mastery }
}

function createInitialGuild() {
  return { level: 1, xp: 0, routes: { trade: 0, explore: 0, combat: 0, social: 0 } }
}

function normalizeGuild(guild = {}) {
  const base = createInitialGuild()
  const xp = guild.xp ?? 0
  return {
    level: Math.max(1, guild.level ?? Math.floor(xp / 220) + 1),
    xp,
    routes: { ...base.routes, ...(guild.routes ?? {}) },
  }
}

function awardGuild(game, route, xp) {
  const guild = normalizeGuild(game.guild)
  const nextXp = guild.xp + xp
  const nextGuild = {
    ...guild,
    xp: nextXp,
    level: Math.max(guild.level, Math.floor(nextXp / 220) + 1),
    routes: { ...guild.routes, [route]: (guild.routes[route] ?? 0) + xp },
  }
  return { ...game, guild: nextGuild }
}

function getGuildRoute(game) {
  const routes = normalizeGuild(game.guild).routes
  return Object.entries(routes).sort((a, b) => b[1] - a[1])[0]?.[0] ?? 'trade'
}

function getGuildBonuses(game) {
  const guild = normalizeGuild(game.guild)
  const level = guild.level
  const route = getGuildRoute(game)
  return {
    tradeBonus: route === 'trade' ? Math.min(level * 0.012, 0.1) : 0,
    routeDiscount: route === 'trade' ? Math.min(level * 0.008, 0.07) : 0,
    exploreDiscount: route === 'explore' ? Math.min(level * 0.014, 0.12) : 0,
    eventLuck: route === 'explore' ? Math.min(level * 0.01, 0.08) : 0,
    combatReduction: route === 'combat' ? Math.min(level * 0.012, 0.1) : 0,
    attack: route === 'combat' ? Math.floor(level / 2) : 0,
    socialBonus: route === 'social' ? Math.min(level, 6) : 0,
    commissionBonus: Math.min(level * 0.006, 0.06),
  }
}

function getFactionForLocation(locationId) {
  return FACTIONS.find((faction) => faction.locationId === locationId) ?? null
}

function getFactionFavor(game, locationId = game.location) {
  const faction = getFactionForLocation(locationId)
  const value = faction ? (game.factions?.[faction.id] ?? 0) : 0
  const tier = FACTION_FAVOR_TIERS.find((item) => value >= item.min) ?? null
  return { faction, value, tier, rank: tier ? FACTION_FAVOR_TIERS.length - FACTION_FAVOR_TIERS.indexOf(tier) : 0 }
}

function getFactionFavorBonus(game, locationId = game.location) {
  const { rank } = getFactionFavor(game, locationId)
  return {
    tradeBonus: Math.min(rank * 0.012, 0.04),
    commissionBonus: Math.min(rank * 0.035, 0.1),
    equipmentSellBonus: Math.min(rank * 0.025, 0.08),
    pressureRelief: rank,
  }
}

function describeFactionFavor(game, locationId = game.location) {
  const favor = getFactionFavor(game, locationId)
  if (!favor.faction) return '本地暂无线人照应。'
  if (!favor.tier) return `${favor.faction.name}好感 ${favor.value}：仍是普通往来，完成委托可逐步打开门路。`
  return `${favor.faction.name}好感 ${favor.value} · ${favor.tier.name}：${favor.tier.text}`
}

function createFactionFavorEvent(game, location) {
  const favor = getFactionFavor(game, location.id)
  if (!favor.tier) return null
  const localGoods = LOCATION_TRAITS[location.id]?.localGoods ?? GOODS.map((good) => good.id)
  const good = goodsById[pick(localGoods)]
  const events = [
    () => ({
      kind: 'goods',
      goodId: good.id,
      amount: rand(1, favor.rank >= 2 ? 2 : 1),
      text: `${favor.faction.name}的熟面孔提前替你留下一份${good.name}样货。`,
    }),
    () => ({
      kind: 'pressure',
      amount: -Math.max(1, favor.rank),
      text: `${favor.faction.name}派人带你避开盘查和闲杂眼线。`,
    }),
  ]
  if (favor.rank >= 2) {
    events.push(() => ({
      kind: 'reward',
      gold: rand(45, 115 + favor.rank * 35),
      rep: 0,
      text: `${favor.faction.name}把一笔临时跑腿钱直接交给你的商号。`,
    }))
  }
  if (favor.rank >= 3) {
    events.push(() => ({
      kind: 'market',
      goodId: good.id,
      factor: rand(116, 138) / 100,
      text: `${favor.faction.name}为你放出优先收购口风，${good.name}在本地更好卖了。`,
    }))
  }
  return pick(events)()
}

function getDemandGoods(locationId) {
  const location = locationsById[locationId]
  const premiumGoods = Object.entries(location?.mod ?? {})
    .filter(([, factor]) => factor >= 1.12)
    .map(([goodId]) => goodId)
  const localGoods = LOCATION_TRAITS[locationId]?.localGoods ?? []
  return [...new Set([...premiumGoods, ...localGoods])].filter((goodId) => goodsById[goodId])
}

function createRouteContract(originId, day) {
  const origin = locationsById[originId] ?? LOCATIONS[0]
  const candidates = LOCATIONS.filter((location) => location.id !== origin.id)
  const target = pick(candidates)
  const demandGoods = getDemandGoods(target.id)
  const good = goodsById[pick(demandGoods.length ? demandGoods : GOODS.map((item) => item.id))]
  const amount = rand(1, target.risk >= 4 ? 3 : 2)
  const riskSpan = Math.max(origin.risk, target.risk)
  const deadline = day + 3 + Math.ceil((origin.risk + target.risk) / 3)
  const rewardGold = Math.round(good.base * amount * (1.55 + riskSpan * 0.18) + target.cost * rand(3, 6))
  return {
    id: `${day}-${origin.id}-${target.id}-${good.id}-${amount}`,
    day,
    originId: origin.id,
    targetId: target.id,
    goodId: good.id,
    amount,
    deadline,
    rewardGold,
    factionId: LOCATION_TRAITS[target.id]?.factionId,
    text: `${pick(ROUTE_CONTRACT_TEXT)}：把${good.name} ×${amount}送到${target.name}。`,
  }
}

function describeRouteContract(contract) {
  if (!contract) return '今日没有可靠跨城商单。'
  const origin = locationsById[contract.originId]
  const target = locationsById[contract.targetId]
  return `${contract.text} 起点 ${origin?.name ?? '本地'}，目的地 ${target?.name ?? '远方'}，期限第 ${contract.deadline} 天。`
}

function getRouteContractStatus(game, contract = game.activeRouteContract) {
  if (!contract) return '暂无已接商单'
  const target = locationsById[contract.targetId]
  const good = goodsById[contract.goodId]
  const have = game.inventory?.[contract.goodId] ?? 0
  const late = game.day > contract.deadline
  if (game.location !== contract.targetId) return `需前往${target?.name ?? '目的地'}${late ? '（已逾期）' : ''}`
  if (have < contract.amount) return `需要 ${good?.name ?? '货物'} ×${contract.amount}，当前 ${have}${late ? '（已逾期）' : ''}`
  return late ? '可逾期交付，奖励降低' : '可完成'
}

function createCommissions(locationId, day) {
  const location = locationsById[locationId]
  const trait = LOCATION_TRAITS[locationId] ?? {}
  const factionId = trait.factionId
  const goods = trait.localGoods ?? GOODS.map((good) => good.id)
  const result = []
  const deliveryGood = goodsById[pick(goods)]
  result.push({
    id: `${day}-${locationId}-delivery-${deliveryGood.id}`,
    type: 'delivery',
    locationId,
    day,
    goodId: deliveryGood.id,
    amount: rand(1, location.risk >= 4 ? 3 : 2),
    rewardGold: Math.round(deliveryGood.base * rand(150, 230) / 100),
    factionId,
    text: `${pick(COMMISSION_TEXT.delivery)}：${location.name}需要${deliveryGood.name}。`,
  })
  result.push({
    id: `${day}-${locationId}-survey`,
    type: 'survey',
    locationId,
    day,
    cost: rand(12, 28 + location.risk * 8),
    rewardGold: rand(55, 130 + location.risk * 28),
    factionId,
    text: `${pick(COMMISSION_TEXT.survey)}：替本地商会查一条新路线。`,
  })
  if (Math.random() > 0.45) {
    result.push({
      id: `${day}-${locationId}-bounty`,
      type: 'bounty',
      locationId,
      day,
      rewardGold: rand(90, 190 + location.risk * 35),
      factionId,
      text: `${pick(COMMISSION_TEXT.bounty)}：处理${location.name}附近的麻烦。`,
    })
  } else {
    const npc = pick(NPCS.filter((item) => item.location === locationId).length ? NPCS.filter((item) => item.location === locationId) : NPCS)
    result.push({
      id: `${day}-${locationId}-social-${npc.id}`,
      type: 'social',
      locationId,
      day,
      npcId: npc.id,
      rewardGold: rand(40, 95 + location.risk * 20),
      factionId,
      text: `${pick(COMMISSION_TEXT.social)}：替人牵线给${npc.role}${npc.name}。`,
    })
  }
  return result
}

function getCommissionStatus(game, commission) {
  if (commission.type === 'delivery') {
    const have = game.inventory?.[commission.goodId] ?? 0
    return have >= commission.amount ? '可完成' : `需要 ${goodsById[commission.goodId].name} ×${commission.amount}`
  }
  if (commission.type === 'survey') return game.gold >= commission.cost ? '可完成' : `需要 ${commission.cost} 金币准备费`
  if (commission.type === 'social') return game.relationships?.[commission.npcId]?.met ? '可完成' : `需先结识 ${npcById[commission.npcId]?.name}`
  return '可接取'
}

function normalizeStats(baseStats, stats = {}) {
  return {
    ...baseStats,
    ...stats,
    explores: stats.explores ?? 0,
    rareLoot: stats.rareLoot ?? 0,
    extremeSurvivals: stats.extremeSurvivals ?? 0,
    factionGain: stats.factionGain ?? 0,
    companionHelps: stats.companionHelps ?? 0,
    commissionsDone: stats.commissionsDone ?? 0,
    routeContractsDone: stats.routeContractsDone ?? 0,
    pressureCleared: stats.pressureCleared ?? 0,
    npcQuests: stats.npcQuests ?? 0,
    landmarksFound: stats.landmarksFound ?? 0,
  }
}

function stableHash(text) {
  return [...text].reduce((sum, char) => (sum * 31 + char.charCodeAt(0)) % 9973, 17)
}

function dayWave(day, key, spread = 0.12) {
  const raw = ((stableHash(`${day}-${key}`) % 101) - 50) / 50
  return 1 + raw * spread
}

function getEquipmentSellPrice(game, item) {
  const location = locationsById[game.location]
  const trait = LOCATION_TRAITS[game.location] ?? {}
  const rarityBonus = 0.46 + (rarityRank[item.rarity] ?? 1) * 0.055
  const slotBonus = trait.slots?.[item.slot] ?? 1
  const sourceBonus = trait.source?.[item.source] ?? 1
  const riskBonus = 1 + Math.max(0, location.risk - 2) * 0.025
  const factionBonus = Math.min(((game.factions?.[trait.factionId] ?? 0) * 0.012), 0.14)
  const newsBonus = (game.worldNews ?? []).some((news) => news.locationId === location.id && news.equipmentSlot === item.slot) ? 1.12 : 1
  const passiveBonus = 1 + getEquipmentPassives(game).sellBonus + getGuildBonuses(game).tradeBonus + getFactionFavorBonus(game).equipmentSellBonus
  const wave = dayWave(game.day, `${location.id}-${item.id}`, 0.1)
  return Math.max(8, Math.round(item.price * rarityBonus * slotBonus * sourceBonus * riskBonus * (1 + factionBonus) * newsBonus * passiveBonus * wave))
}

function describeEquipmentMarket(game) {
  const location = locationsById[game.location]
  const trait = LOCATION_TRAITS[game.location]
  if (!trait) return `${location.name}装备行情平稳。`
  const slots = Object.entries(trait.slots ?? {})
    .sort((a, b) => b[1] - a[1])
    .slice(0, 2)
    .map(([slot]) => slotName(slot))
    .join('、')
  const favor = getFactionFavor(game, location.id)
  const favorText = favor.tier ? ` ${favor.tier.name}会让回收价更好。` : ''
  return `${location.name}装备行情：${trait.equipmentHint}${slots ? ` 今日更偏好${slots}。` : ''}${favorText}`
}

function createRouteCondition(day, locationId) {
  const risk = locationsById[locationId]?.risk ?? 2
  const pool = ROUTE_CONDITIONS.flatMap((condition) => {
    const riskBias = risk >= 4 && ['drizzle', 'shortage', 'omens'].includes(condition.id) ? 5 : 0
    const safeBias = risk <= 2 && ['clear', 'patrol', 'crowded'].includes(condition.id) ? 4 : 0
    return Array.from({ length: condition.weight + riskBias + safeBias }, () => condition)
  })
  const condition = pick(pool)
  return { id: `${day}-${locationId}-${condition.id}`, conditionId: condition.id, day, locationId }
}

function getRouteConditionEffect(condition) {
  return routeConditionById[condition?.conditionId ?? condition?.id] ?? ROUTE_CONDITIONS[0]
}

function describeRouteCondition(condition) {
  const effect = getRouteConditionEffect(condition)
  const location = locationsById[condition?.locationId]
  const place = location ? `${location.name}周边` : '今日商路'
  const travel = effect.travelCost < 1 ? '路费降低' : effect.travelCost > 1 ? '路费上升' : '路费平稳'
  const explore = effect.exploreCost < 1 ? '探索省补给' : effect.exploreCost > 1 ? '探索更耗费' : '探索平稳'
  const danger = effect.danger < 0 ? '遇险下降' : effect.danger > 0 ? '遇险上升' : '遇险平稳'
  return `${place}路况：${effect.name}，${travel}、${explore}、${danger}。${effect.text}`
}

function createLocalScene(day, locationId) {
  const location = locationsById[locationId] ?? LOCATIONS[0]
  const templates = LOCAL_SCENE_TEMPLATES[location.id] ?? Object.values(LOCAL_SCENE_TEMPLATES).flat()
  const pool = templates.flatMap((template) => Array.from({ length: template.weight ?? 1 }, () => template))
  const template = pick(pool.length ? pool : templates)
  const fallbackGoods = LOCATION_TRAITS[location.id]?.localGoods ?? GOODS.map((good) => good.id)
  const goodId = pick(template.goodIds ?? fallbackGoods)
  const factor = Number(clamp(template.factor * dayWave(day, `${location.id}-${template.id}-${goodId}`, 0.06), 0.62, 1.55).toFixed(2))
  return {
    id: `${day}-${location.id}-${template.id}-${goodId}`,
    day,
    locationId: location.id,
    sceneId: template.id,
    name: template.name,
    goodId,
    factor,
    pressure: template.pressure ?? 0,
    text: template.text,
  }
}

function describeLocalScene(scene) {
  if (!scene) return '今日本地日势平稳。'
  const location = locationsById[scene.locationId]
  const good = goodsById[scene.goodId]
  const move = scene.factor > 1.04 ? '走强' : scene.factor < 0.96 ? '走低' : '平稳'
  const pressure = scene.pressure > 0 ? `风险压力 +${scene.pressure}` : scene.pressure < 0 ? `风险压力 ${scene.pressure}` : '风险压力不变'
  return `本地日势：${location?.name ?? '本地'} - ${scene.name}，${good?.name ?? '货物'}${move}。${scene.text} ${pressure}。`
}

function createWorldNews(day) {
  const location = pick(LOCATIONS)
  const trait = LOCATION_TRAITS[location.id]
  const goodId = pick(trait?.localGoods ?? GOODS.map((good) => good.id))
  const equipmentSlot = pick(['weapon', 'armor', 'trinket'])
  const direction = Math.random() > 0.45 ? 'up' : 'down'
  return [{
    id: `${day}-${location.id}-${goodId}-${equipmentSlot}-${direction}`,
    day,
    locationId: location.id,
    goodId,
    equipmentSlot,
    direction,
    factor: direction === 'up' ? rand(116, 138) / 100 : rand(78, 92) / 100,
    text: direction === 'up'
      ? `${location.name}传来大陆新闻：${goodsById[goodId].name}和${slotName(equipmentSlot)}需求升温。`
      : `${location.name}传来大陆新闻：${goodsById[goodId].name}库存压仓，${slotName(equipmentSlot)}收购趋谨慎。`,
  }]
}

function describeWorldNews(news) {
  return news.text
}

function advanceDay(game, nextDay, locationId = game.location) {
  const passives = getEquipmentPassives(game)
  const updates = {
    day: nextDay,
    rumors: createRumors(nextDay, passives.rumorBonus),
    commissions: createCommissions(locationId, nextDay),
    routeContract: createRouteContract(locationId, nextDay),
    routeCondition: createRouteCondition(nextDay, locationId),
    localScene: createLocalScene(nextDay, locationId),
  }
  if (nextDay % 7 === 0) updates.worldNews = createWorldNews(nextDay)
  return updates
}

function formatLogEntry(game, entry) {
  if (/^第\s*\d+\s*天/.test(entry) || entry.startsWith('早期记录')) return entry
  return `第 ${game.day} 天：${entry}`
}

function getLogDay(entry, fallbackDay) {
  const match = String(entry).match(/^第\s*(\d+)\s*天/)
  if (match) return Number(match[1])
  return fallbackDay ? Number(fallbackDay) : 0
}

function groupLogsByDay(logs, currentDay) {
  const groups = []
  logs.forEach((entry) => {
    const day = getLogDay(entry, currentDay)
    const label = day > 0 ? `第 ${day} 天` : '早期记录'
    let group = groups.find((item) => item.label === label)
    if (!group) {
      group = { label, entries: [] }
      groups.push(group)
    }
    group.entries.push(String(entry).replace(/^第\s*\d+\s*天[：,，]\s*/, ''))
  })
  return groups
}

function parseLogEntry(entry) {
  const match = String(entry).match(/^【([^】]+)】(.+)$/)
  return match ? { tag: match[1], text: match[2] } : { tag: '记录', text: entry }
}

function achievementCategory(achievement) {
  if (['firstBond', 'warmHeart', 'confession', 'firstMarriage', 'manyLoves', 'dates', 'giftGiver', 'companionRoad', 'personalQuests'].includes(achievement.id)) return '人物'
  if (['fighter', 'veteran', 'rareHunter', 'extremeRoad', 'firstLandmark', 'landmarkAtlas'].includes(achievement.id)) return '冒险'
  if (['explorer', 'deepExplorer', 'connected', 'longRun'].includes(achievement.id)) return '旅途'
  if (['factionFriend', 'alliedNetwork'].includes(achievement.id)) return '势力'
  return '经营'
}

function createRumors(day, extra = 0) {
  const count = rand(2, 3) + extra
  return [...LOCATIONS]
    .sort(() => Math.random() - 0.5)
    .slice(0, count)
    .map((location) => {
      const candidateGoods = Object.entries(location.mod)
        .filter(([, mod]) => mod <= 0.82 || mod >= 1.18)
        .map(([id]) => id)
      const goodId = pick(candidateGoods.length ? candidateGoods : GOODS.map((good) => good.id))
      const direction = Math.random() > 0.48 ? 'up' : 'down'
      return {
        id: `${day}-${location.id}-${goodId}-${direction}-${rand(10, 99)}`,
        day,
        locationId: location.id,
        goodId,
        direction,
        strength: rand(16, 34) / 100,
      }
    })
}

function describeRumor(rumor) {
  const location = locationsById[rumor.locationId]
  const good = goodsById[rumor.goodId]
  const verb = rumor.direction === 'up' ? '可能涨价' : '可能走低'
  return `明日风向：${location.name}的${good.name}${verb}。`
}

function rollMarket(locationId, rumors = [], worldNews = [], localScene = null) {
  const market = Object.fromEntries(GOODS.map((good) => [good.id, Number((0.72 + Math.random() * 0.58).toFixed(2))]))
  const specialCount = rand(1, 3)
  const specialGoods = [...GOODS].sort(() => Math.random() - 0.5).slice(0, specialCount)
  specialGoods.forEach((good) => {
    const factor = Math.random() > 0.5 ? rand(136, 176) / 100 : rand(48, 68) / 100
    market[good.id] = Number(clamp(market[good.id] * factor, 0.42, 1.95).toFixed(2))
  })
  rumors
    .filter((rumor) => rumor.locationId === locationId)
    .forEach((rumor) => {
      const factor = rumor.direction === 'up' ? 1 + rumor.strength : 1 - rumor.strength
      market[rumor.goodId] = Number(clamp((market[rumor.goodId] ?? 1) * factor, 0.42, 1.95).toFixed(2))
    })
  worldNews
    .filter((news) => news.locationId === locationId)
    .forEach((news) => {
      market[news.goodId] = Number(clamp((market[news.goodId] ?? 1) * news.factor, 0.42, 1.95).toFixed(2))
    })
  if (localScene?.locationId === locationId && localScene.goodId) {
    market[localScene.goodId] = Number(clamp((market[localScene.goodId] ?? 1) * localScene.factor, 0.42, 1.95).toFixed(2))
  }
  return market
}

function createStarterInventory() {
  const inventory = {}
  const count = rand(2, 4)
  const selected = [...STARTER_GOODS].sort(() => Math.random() - 0.5).slice(0, count)
  selected.forEach((goodId) => {
    inventory[goodId] = rand(1, goodId === 'ore' ? 2 : 4)
  })
  return inventory
}

function describeInventory(inventory) {
  const entries = Object.entries(inventory).filter(([, qty]) => qty > 0)
  if (!entries.length) return '没有起始货物'
  return entries.map(([id, qty]) => `${goodsById[id].name} × ${qty}`).join('、')
}

function describeBackground(background) {
  const parts = [
    ['金币', background.gold],
    ['生命', background.maxHp],
    ['攻击', background.attack],
    ['防御', background.defense],
    ['货舱', background.capacity],
    ['声望', background.reputation],
  ]
    .filter(([, value]) => value !== 0)
    .map(([label, value]) => `${label} ${value > 0 ? '+' : ''}${value}`)
  return parts.length ? parts.join(' / ') : '无数值修正'
}

function createEmptyRelationships() {
  return Object.fromEntries(
    NPCS.map((npc) => [
      npc.id,
      { met: false, affection: 0, stage: '陌生', interactions: 0, gifts: 0, dates: 0, cooperations: 0, confessed: false, married: false, lastInteractionDay: 0 },
    ]),
  )
}

function normalizeRelationships(relationships = {}) {
  const empty = createEmptyRelationships()
  return Object.fromEntries(
    NPCS.map((npc) => {
      const existing = relationships?.[npc.id] ?? {}
      return [npc.id, { ...empty[npc.id], ...existing, lastInteractionDay: existing.lastInteractionDay ?? 0 }]
    }),
  )
}

function createInitialGame() {
  const background = pick(START_BACKGROUNDS)
  const startLocation = pick(LOCATIONS)
  const inventory = createStarterInventory()
  const rumors = createRumors(1)
  const gold = Math.max(520, 720 + rand(-90, 170) + background.gold)
  const baseMaxHp = 108 + rand(-5, 16) + background.maxHp
  const baseAttack = 12 + rand(-1, 3) + background.attack
  const baseDefense = 7 + rand(-1, 4) + background.defense
  const baseCapacity = 42 + rand(-3, 10) + background.capacity
  const worldNews = createWorldNews(1)
  const commissions = createCommissions(startLocation.id, 1)
  const routeCondition = createRouteCondition(1, startLocation.id)
  const localScene = createLocalScene(1, startLocation.id)

  return {
    version: VERSION,
    day: 1,
    location: startLocation.id,
    gold,
    hp: baseMaxHp,
    baseMaxHp,
    baseAttack,
    baseDefense,
    reputation: background.reputation,
    baseCapacity,
    background,
    inventory,
    equipmentOwned: [],
    equipped: { weapon: null, armor: null, trinket: null },
    market: rollMarket(startLocation.id, rumors, worldNews, localScene),
    rumors,
    worldNews,
    routeCondition,
    localScene,
    commissions,
    routeContract: createRouteContract(startLocation.id, 1),
    activeRouteContract: null,
    factions: createInitialFactions(),
    guild: createInitialGuild(),
    locationMastery: createInitialLocationMastery(),
    discoveries: createInitialDiscoveries(),
    riskPressure: 0,
    activeAssist: null,
    relationships: createEmptyRelationships(),
    knownNpcIds: [],
    partners: [],
    combat: null,
    gameOver: false,
    stats: {
      trades: 0,
      travels: 0,
      battlesWon: 0,
      events: 0,
      goodsMoved: 0,
      profit: 0,
      maxGold: gold,
      dates: 0,
      gifts: 0,
      socialActions: 0,
      explores: 0,
      rareLoot: 0,
      extremeSurvivals: 0,
      factionGain: 0,
      companionHelps: 0,
      commissionsDone: 0,
      routeContractsDone: 0,
      pressureCleared: 0,
      npcQuests: 0,
      landmarksFound: 0,
    },
    achievements: [],
    log: [
      `第 1 天：本局开局：你从${startLocation.name}出发，背景是“${background.name}”。`,
      `第 1 天：身份影响：${describeBackground(background)}。起始货物：${describeInventory(inventory)}。${background.text}`,
      `第 1 天：${describeRouteCondition(routeCondition)}`,
      `第 1 天：${describeLocalScene(localScene)}`,
      ...worldNews.map((news) => `第 1 天：${describeWorldNews(news)}`),
      ...rumors.map((rumor) => `第 1 天：${describeRumor(rumor)}`),
      ...START_LOG.slice(1).map((entry) => `第 1 天：${entry}`),
    ],
  }
}

function getTotals(game) {
  const guildBonuses = getGuildBonuses(game)
  const equipmentBonuses = Object.values(game.equipped)
    .filter(Boolean)
    .map((uid) => (game.equipmentOwned ?? []).find((item) => item.uid === uid))
    .map(getEquipmentItem)
    .filter(Boolean)
    .reduce(
      (sum, item) => ({
        attack: sum.attack + item.attack,
        defense: sum.defense + item.defense,
        maxHp: sum.maxHp + item.maxHp,
        capacity: sum.capacity + item.capacity,
        reputation: sum.reputation + item.reputation,
      }),
      { attack: 0, defense: 0, maxHp: 0, capacity: 0, reputation: 0 },
    )
  const partnerBonuses = (game.partners ?? [])
    .map((id) => npcById[id]?.bonus)
    .filter(Boolean)
    .reduce(
      (sum, item) => ({
        attack: sum.attack + (item.attack ?? 0),
        defense: sum.defense + (item.defense ?? 0),
        maxHp: sum.maxHp + (item.maxHp ?? 0),
        capacity: sum.capacity + (item.capacity ?? 0),
        reputation: sum.reputation + (item.reputation ?? 0),
      }),
      { attack: 0, defense: 0, maxHp: 0, capacity: 0, reputation: 0 },
    )

  return {
    attack: game.baseAttack + equipmentBonuses.attack + partnerBonuses.attack + guildBonuses.attack,
    defense: game.baseDefense + equipmentBonuses.defense + partnerBonuses.defense,
    maxHp: game.baseMaxHp + equipmentBonuses.maxHp + partnerBonuses.maxHp,
    capacity: game.baseCapacity + equipmentBonuses.capacity + partnerBonuses.capacity,
    reputation: game.reputation + equipmentBonuses.reputation + partnerBonuses.reputation,
  }
}

function getCargoUsed(game) {
  return Object.entries(game.inventory).reduce((sum, [id, qty]) => sum + (goodsById[id]?.weight ?? 0) * qty, 0)
}

function getPrice(game, goodId, mode = 'buy') {
  const location = locationsById[game.location]
  const good = goodsById[goodId]
  const locationMod = location.mod[goodId] ?? 1
  const repDiscount = Math.min(getTotals(game).reputation * 0.006, 0.1)
  const assist = getAssist(game)
  const passives = getEquipmentPassives(game)
  const guildBonuses = getGuildBonuses(game)
  const factionFavor = getFactionFavorBonus(game)
  const typeBonus = passives.goodTypeBonus && good.type === passives.goodTypeBonus ? 0.05 : 0
  const bargain = (assist?.type === 'bargain' ? 0.06 : 0) + passives.tradeBonus + guildBonuses.tradeBonus + factionFavor.tradeBonus + typeBonus
  const buyPrice = good.base * locationMod * (game.market[goodId] ?? 1) * (1 - repDiscount - bargain)
  return Math.max(1, Math.round(mode === 'sell' ? buyPrice * (0.82 + bargain) : buyPrice))
}

function getPriceLabel(game, goodId) {
  const location = locationsById[game.location]
  const ratio = (location.mod[goodId] ?? 1) * (game.market[goodId] ?? 1)
  if (ratio <= 0.72) return '低价'
  if (ratio <= 0.95) return '偏低'
  if (ratio < 1.18) return '平价'
  if (ratio < 1.45) return '偏贵'
  return '暴涨'
}

function getTodayFocus(game) {
  const bestGoods = GOODS
    .map((good) => ({ good, sell: getPrice(game, good.id, 'sell'), ratio: (locationsById[game.location].mod[good.id] ?? 1) * (game.market[good.id] ?? 1) }))
    .sort((a, b) => b.ratio - a.ratio)
    .slice(0, 3)
    .map((item) => `${item.good.name} ${item.sell}`)
    .join(' / ')
  const route = routeLabels[getGuildRoute(game)] ?? '跑商'
  const pressure = game.riskPressure ?? 0
  const pressureText = pressure >= 18 ? '危险盯梢' : pressure >= 10 ? '压力偏高' : '车队平稳'
  const commission = (game.commissions ?? [])[0]
  return {
    bestGoods,
    route,
    pressureText,
    condition: getRouteConditionEffect(game.routeCondition).name,
    localScene: game.localScene?.name ?? '平稳市面',
    commission: commission ? `${commissionLabels[commission.type]}：${commission.text}` : '今日暂无委托',
    mastery: `本地熟练度 ${getMasteryLevel(game, game.location)} 级 · ${getFactionFavor(game).tier?.name ?? '普通往来'}`,
  }
}

function riskLevel(risk) {
  if (risk <= 1) return '低风险'
  if (risk <= 3) return '中风险'
  if (risk === 4) return '高风险'
  return '极危'
}

function relationStage(rel) {
  if (rel.married) return '伴侣'
  if (rel.confessed) return '恋人'
  if (rel.affection >= 70) return '亲密'
  if (rel.affection >= 40) return '暧昧'
  if (rel.affection >= 15) return '熟悉'
  return rel.met ? '初识' : '陌生'
}

function npcLine(npc, key, rel) {
  if (key === 'date' && rel.affection >= 70 && npc.lines.intimate?.length) return pick(npc.lines.intimate)
  const lines = npc.lines[key]
  return Array.isArray(lines) ? pick(lines) : lines
}

function relationshipHint(npc, rel) {
  if (rel.married) return `${npc.name}已经把自己的商路与你并在一起，伴侣加成正在生效。`
  if (rel.confessed) return `${npc.name}接受了你的心意；好感达到 75 后可以结婚。`
  if (rel.affection >= 70) return `${npc.name}已经很难掩饰亲近，高好感相处会触发更私密的夜晚。`
  if (rel.affection >= 45) return `${npc.name}正在等待你更明确的表白。`
  return '交谈、相处、送礼和合作都能推进关系。'
}

function getAssist(game) {
  const assist = game.activeAssist
  if (!assist || assist.expiresDay < game.day) return null
  return assist
}

function describeAssist(game) {
  const assist = getAssist(game)
  if (!assist) return '当前没有同行协助。'
  const npc = npcById[assist.npcId]
  const label = {
    route: '降低旅行路费',
    scout: '降低探索补给',
    guard: '减轻战斗伤害',
    bargain: '提高交易谈价',
  }[assist.type]
  return `${npc?.name ?? '同伴'}正在协助：${label}，持续到第 ${assist.expiresDay} 天。`
}

function getNpcAssistType(npcId) {
  if (['lina', 'avel'].includes(npcId)) return 'bargain'
  if (['kael', 'rhea', 'selene'].includes(npcId)) return 'guard'
  if (['naya', 'mira'].includes(npcId)) return 'scout'
  return 'route'
}

function createNpcQuestOutcome(game, npc, rel) {
  const intimate = rel.affection >= 70
  const commonGain = intimate ? rand(14, 22) : rand(9, 15)
  const outcomes = {
    lina: () => ({ gain: commonGain, gold: rand(120, 260), factionId: 'harborAuction', text: intimate ? '莉娜邀你参加闭门拍卖。她在桌下轻轻勾住你的手指，抬价时却比任何人都冷静，最后把利润和一个只属于夜晚的眼神一起交给你。' : '莉娜带你旁听一场小拍卖，教你什么时候沉默比报价更值钱。' }),
    kael: () => ({ gain: commonGain, hp: rand(18, 34), pressure: -3, text: intimate ? '凯尔陪你守夜到风雪停下，披风下的体温让沉默变得很近。天亮时车队少了几分紧绷，多了几分底气。' : '凯尔替你重排护卫轮值，车队夜里睡得更稳。' }),
    mira: () => ({ gain: commonGain, rumors: true, factionId: 'skyFaculty', text: intimate ? '米拉把你留在观星室共同校对星图，纸页被风吹乱时你们靠得很近。她红着耳尖说，今晚的结论只写进私人笔记。' : '米拉请你协助整理行情样本，导师团因此愿意分享更多情报。' }),
    selene: () => ({ gain: commonGain, hp: rand(28, 46), goodId: 'herb', amount: rand(1, 3), text: intimate ? '塞琳带你去月树下采药，指尖替你拂开叶露，草木香在近处慢慢发甜。回程时她把药包塞进你怀里。' : '塞琳教你分辨几种银叶药草，顺手补满了随车药包。' }),
    oran: () => ({ gain: commonGain, capacity: 1, goodId: 'gear', amount: rand(1, 2), factionId: 'emberUnion', text: intimate ? '奥兰嘴上嫌你碍事，却把你留在炉边最暖的位置。火光暗下去后，他用行动证明货车和心事都能修得更稳。' : '奥兰让你搭手改装货车底盘，工匠联盟也记住了你的勤快。' }),
    naya: () => ({ gain: commonGain, reputation: 1, pressure: -2, factionId: 'sandVeil', text: intimate ? '娜雅把你带进沙帘后的密谈，声音压得很低，危险像香料一样贴近。你带走了情报，也带走她指尖短暂停留的余温。' : '娜雅安排你听了一场绿洲密谈，几条麻烦路线被提前避开。' }),
    avel: () => ({ gain: commonGain, reputation: 2, gold: rand(80, 180), factionId: 'whiteGuild', text: intimate ? '阿维尔邀你出席贵族晚宴，礼仪像薄冰一样禁忌。他在无人回廊里替你整理领口，然后把体面和偏爱都给得恰到好处。' : '阿维尔替你引见几位王都账房，商号名声更响。' }),
    rhea: () => ({ gain: commonGain, equipmentId: pickLootEquipment(5)?.id, goodId: 'relic', amount: 1, pressure: 2, text: intimate ? '蕾娅带你钻进一处未登记的遗迹，火把熄灭前她笑着贴近，说危险之后的奖励才最真实。清晨你们带着战利品离开。' : '蕾娅带你走了一条遗迹捷径，虽然惊险，但确实有所收获。' }),
  }
  return (outcomes[npc.id] ?? outcomes.lina)()
}

function maybePartnerEvent(game) {
  const partners = game.partners ?? []
  if (!partners.length || game.combat || Math.random() > 0.28) return game
  const npc = npcById[pick(partners)]
  if (!npc) return game
  let next = { ...game }
  if (npc.id === 'selene') next = { ...next, hp: next.hp + rand(8, 18) }
  if (npc.id === 'lina') next = { ...next, gold: next.gold + rand(30, 75) }
  if (npc.id === 'mira') next = { ...next, rumors: createRumors(next.day) }
  if (npc.id === 'oran') next = { ...next, baseCapacity: next.baseCapacity + 1 }
  if (npc.id === 'rhea') next = { ...next, inventory: { ...next.inventory, relic: (next.inventory.relic ?? 0) + 1 } }
  if (npc.id === 'kael') next = { ...next, hp: next.hp + rand(6, 14) }
  if (npc.id === 'naya') next = { ...next, reputation: next.reputation + 1 }
  if (npc.id === 'avel') next = { ...next, reputation: next.reputation + 1, gold: next.gold + rand(20, 60) }
  return addLog(next, pick(npc.lines.partner))
}

function addLog(game, entry) {
  const tagged = String(entry).startsWith('【') ? entry : `【记录】${entry}`
  return { ...game, log: [formatLogEntry(game, tagged), ...(game.log ?? [])].slice(0, 120) }
}

function addTaggedLog(game, tag, entry) {
  return addLog(game, `【${tag}】${entry}`)
}

function finish(game) {
  let next = {
    ...game,
    hp: clamp(game.hp, 0, getTotals(game).maxHp),
    stats: { ...game.stats, maxGold: Math.max(game.stats.maxGold, game.gold) },
  }

  const unlocked = ACHIEVEMENTS.filter((achievement) => !next.achievements.includes(achievement.id) && achievement.test(next))
  if (unlocked.length) {
    next = {
      ...next,
      achievements: [...next.achievements, ...unlocked.map((achievement) => achievement.id)],
      log: [
        ...unlocked.map((achievement) => formatLogEntry(next, `成就解锁：${achievement.name}。${achievement.text}`)),
        ...next.log,
      ].slice(0, 120),
    }
  }

  return next
}

function pickLootEquipment(risk) {
  const maxRank = risk >= 5 ? 5 : risk >= 3 ? 4 : 3
  const candidates = EQUIPMENT.filter((item) => item.source === 'loot' && rarityRank[item.rarity] <= maxRank)
  return candidates.length ? pick(candidates) : null
}

function generateRewards(risk, baseGold = 0, locationId = null) {
  const rewards = []
  const gold = Math.max(0, baseGold + rand(18, 42 + risk * 18))
  if (gold) rewards.push({ type: 'gold', amount: gold })
  const localGoods = locationId ? (LOCATION_TRAITS[locationId]?.localGoods ?? []) : []

  const extraCount = rand(1, 3)
  for (let i = 0; i < extraCount; i += 1) {
    const roll = Math.random()
    if (roll < 0.48) {
      const pool = Math.random() < 0.65 && localGoods.length ? localGoods.map((id) => goodsById[id]) : GOODS.filter((item) => rarityRank[item.rarity] <= Math.min(5, risk + 2))
      const good = pick(pool)
      rewards.push({ type: 'good', goodId: good.id, amount: rand(1, risk >= 4 ? 3 : 2) })
    } else if (roll < 0.72) {
      rewards.push({ type: 'gold', amount: rand(20, 70 + risk * 20) })
    } else {
      const item = pickLootEquipment(risk + (locationId === 'ruins' ? 1 : 0))
      if (item) rewards.push({ type: 'equipment', itemId: item.id })
    }
  }

  return rewards
}

function applyRewards(game, rewards) {
  return rewards.reduce((next, reward) => {
    if (reward.type === 'gold') return { ...next, gold: next.gold + reward.amount }
    if (reward.type === 'good') {
      return {
        ...next,
        inventory: { ...next.inventory, [reward.goodId]: (next.inventory[reward.goodId] ?? 0) + reward.amount },
      }
    }
    if (reward.type === 'equipment') {
      const item = equipmentById[reward.itemId]
      const rareLoot = (rarityRank[item?.rarity] ?? 1) >= 4 ? 1 : 0
      return {
        ...next,
        equipmentOwned: [...(next.equipmentOwned ?? []), createEquipmentInstance(reward.itemId)],
        stats: { ...next.stats, rareLoot: (next.stats.rareLoot ?? 0) + rareLoot },
      }
    }
    return next
  }, game)
}

function describeRewards(rewards) {
  const groupedGold = rewards.filter((reward) => reward.type === 'gold').reduce((sum, reward) => sum + reward.amount, 0)
  const parts = []
  if (groupedGold) parts.push(`${groupedGold} 金币`)
  rewards.filter((reward) => reward.type === 'good').forEach((reward) => {
    parts.push(`${goodsById[reward.goodId].name} ×${reward.amount}`)
  })
  rewards.filter((reward) => reward.type === 'equipment').forEach((reward) => {
    parts.push(equipmentById[reward.itemId].name)
  })
  return parts.join('、')
}

function makeEnemy(risk, locationId = null) {
  const local = ENEMIES.filter((enemy) => enemy.minRisk <= risk && enemy.locations?.includes(locationId))
  const candidates = local.length ? local : ENEMIES.filter((enemy) => enemy.minRisk <= risk && !enemy.locations)
  const base = pick(candidates)
  const scale = 0.88 + Math.max(0, risk - base.minRisk) * 0.06
  const rewardScale = rand(96, 136) / 100
  return {
    name: base.name,
    hp: Math.round(base.hp * scale),
    maxHp: Math.round(base.hp * scale),
    attack: Math.round(base.attack * scale * 0.88),
    defense: Math.round(base.defense * scale),
    gold: Math.round(base.gold * scale * rewardScale),
    rep: base.rep,
    risk,
    locationId,
  }
}

function createLocalEvent(game, location, mode = 'travel') {
  const trait = LOCATION_TRAITS[location.id]
  const factionId = trait?.factionId
  const localGoods = trait?.localGoods ?? GOODS.map((good) => good.id)
  const localGood = goodsById[pick(localGoods)]
  const localNpc = pick(NPCS.filter((npc) => npc.location === location.id).length ? NPCS.filter((npc) => npc.location === location.id) : NPCS)
  const templates = {
    capital: [
      () => ({ kind: 'faction', factionId, amount: 1, gold: rand(70, 150), text: `白塔税务官查验你的账本，你用清楚的货单换来${FACTIONS.find((f) => f.id === factionId)?.name}的信任。` }),
      () => ({ kind: 'market', goodId: 'silk', factor: rand(118, 145) / 100, text: '王都宴会季临近，晨曦丝绸被贵族管家提前抢订。' }),
      () => ({ kind: 'cost', gold: Math.min(game.gold, rand(25, 80)), text: '内城临时税卡要求补缴通行契印费。' }),
    ],
    port: [
      () => ({ kind: 'goods', goodId: pick(['pearl', 'spice', 'wine']), amount: rand(1, 3), text: '一艘远洋船提前卸货，船副愿意用样品抵一部分搬运费。' }),
      () => ({ kind: 'faction', factionId, amount: 1, gold: rand(60, 130), text: '港口拍卖行临时缺少可信跑腿，你替他们送达密封拍品。' }),
      () => ({ kind: 'market', goodId: 'pearl', factor: rand(122, 155) / 100, text: '海民宣布珍珠评级新规，潮汐珍珠价格被推高。' }),
    ],
    mine: [
      () => ({ kind: 'battle', enemy: makeEnemy(location.risk, location.id), text: '矿洞深处传来铁轨断裂声，黑暗里有东西扑向货车。' }),
      () => ({ kind: 'goods', goodId: pick(['ore', 'mithril', 'gear']), amount: rand(1, 3), text: '矿工用刚出炉的矿样换你车上的干粮。' }),
      () => ({ kind: 'faction', factionId, amount: 1, gold: rand(50, 120), text: '工匠联盟请你转运一箱备用铆钉，工头在账上给你记了一笔人情。' }),
    ],
    forest: [
      () => ({ kind: 'life', hp: rand(18, 34), text: '月影药师会给你一盏草木热饮，伤口和疲惫一起松开。' }),
      () => ({ kind: 'npc', npcId: localNpc.id, affection: rand(10, 18), text: `林间雾气散开时，${localNpc.name}正等在一棵银叶树下。${localNpc.text}` }),
      () => ({ kind: 'goods', goodId: pick(['herb', 'moon', 'wine', 'amber']), amount: rand(1, 3), text: '你在精灵集市帮忙收摊，摊主送来一小包林地特产。' }),
    ],
    fort: [
      () => ({ kind: 'battle', enemy: makeEnemy(location.risk, location.id), text: '北境巡逻线外烟尘骤起，一队逃兵盯上了你的补给。' }),
      () => ({ kind: 'faction', factionId, amount: 2, gold: rand(85, 180), text: '军需官核准你的货车进入内库，北境军需处对你的商号更放心了。' }),
      () => ({ kind: 'market', goodId: pick(['grain', 'candle', 'spice']), factor: rand(125, 165) / 100, text: '前线换防，军需清单突然加厚，民生和慰问货被抬价。' }),
    ],
    oasis: [
      () => ({ kind: 'npc', npcId: localNpc.id, affection: rand(8, 16), text: `沙帘后的低语把你引向${localNpc.name}。${localNpc.text}` }),
      () => ({ kind: 'faction', factionId, amount: 1, gold: rand(70, 160), text: '沙海密探网卖给你一条半真半假的路线，你转手验证后反而赚到情报钱。' }),
      () => ({ kind: 'cost', gold: Math.min(game.gold, rand(35, 95)), text: '沙暴迫使车队绕行，额外水袋和骆驼租金掏空了一小袋金币。' }),
    ],
    academy: [
      () => ({ kind: 'rumor', text: '学院导师翻看你的货单，重新推算了几条更可信的明日风向。' }),
      () => ({ kind: 'faction', factionId, amount: 1, gold: rand(90, 190), text: '导师团收下你的样本记录，给出研究津贴和一枚临时通行徽章。' }),
      () => ({ kind: 'market', goodId: pick(['crystal', 'scroll', 'ink', 'map']), factor: rand(118, 152) / 100, text: '期末炼金考核临近，学院材料窗口排起长队。' }),
    ],
    ruins: [
      () => ({ kind: 'battle', enemy: makeEnemy(location.risk, location.id), text: '遗迹石门后的旧机关亮起，沉睡的守卫把你判作闯入者。' }),
      () => ({ kind: 'loot', rewards: generateRewards(location.risk, rand(80, 160), location.id), text: '你在古龙浮雕后的暗格里找到一批被遗忘的战利品。' }),
      () => ({ kind: 'hurt', hp: rand(12, 28), text: '遗迹机关擦着肩头弹开，碎石和热风让你吃了点苦头。' }),
    ],
    forge: [
      () => ({ kind: 'faction', factionId, amount: 1, gold: rand(55, 125), text: '赤铜工坊让你试运一台新式绞盘，工匠们认可了你的胆量。' }),
      () => ({ kind: 'goods', goodId: pick(['gear', 'ore', 'candle']), amount: rand(1, 3), text: '炉边试制品多出几件，工匠爽快地塞进你的货箱。' }),
      () => ({ kind: 'equipment', itemId: pickLootEquipment(location.risk)?.id ?? 'lantern', text: '你帮工匠找回丢失的模具，对方从旧货架上挑出一件装备谢你。' }),
    ],
  }
  const shared = [
    () => ({ kind: 'goods', goodId: localGood.id, amount: rand(1, 2), text: `${location.name}的本地商贩用${localGood.name}抵掉一笔小账。` }),
    () => ({ kind: 'npc', npcId: localNpc.id, affection: rand(6, 12), text: `你在${mode === 'explore' ? '探索' : '旅途'}中与${localNpc.name}短暂同行。${localNpc.text}` }),
    () => ({ kind: 'market', goodId: localGood.id, factor: rand(116, 146) / 100, text: `${location.name}的行会布告突然点名${localGood.name}，本地买家开始抬价。` }),
    () => ({ kind: 'market', goodId: localGood.id, factor: rand(62, 84) / 100, text: `${location.name}有一批${localGood.name}压仓清出，短期行情被砸低。` }),
    () => ({ kind: 'faction', factionId, amount: 1, gold: rand(35, 105), text: `${location.name}的地方执事请你核对一份旧账，你的商号在本地多了一个可靠评价。` }),
    () => ({ kind: 'loot', rewards: generateRewards(location.risk, rand(20, 70), location.id), text: `${location.name}一条不起眼的支路藏着被遗忘的货箱。` }),
    () => ({ kind: 'equipment', itemId: pickLootEquipment(location.risk)?.id ?? 'ledger', text: `${location.name}的鉴定师认出你手上有眼力，转让给你一件压箱底的装备。` }),
    () => ({ kind: 'cost', gold: Math.min(game.gold, rand(18, 58 + location.risk * 8)), text: `${location.name}临时整顿市面，货车被收了一笔场地和检验费。` }),
    () => ({ kind: 'hurt', hp: rand(6, 16 + location.risk * 3), text: `${location.name}的旧路比传闻更难走，搬货时一阵混乱让你受了轻伤。` }),
    () => ({ kind: 'life', hp: rand(12, 28), text: `${location.name}一位好心店主留你喝了热汤，疲惫被压下去不少。` }),
    () => ({ kind: 'rumor', text: `${location.name}的酒桌闲谈给了你新的行情侧写。` }),
    () => ({ kind: 'pressure', amount: -rand(1, 3), text: `${location.name}的熟门熟路让车队轻松不少，风险压力下降。` }),
  ]
  const favorEvent = createFactionFavorEvent(game, location)
  if (favorEvent && Math.random() < 0.16 + getFactionFavor(game, location.id).rank * 0.05) return favorEvent
  return pick([...(templates[location.id] ?? []), ...shared])()
}

function createTravelEvent(game, destination, routeCondition = game.routeCondition) {
  const risk = Math.max(1, Math.ceil((locationsById[game.location].risk + destination.risk) / 2))
  const totals = getTotals(game)
  const luck = getEquipmentPassives(game).eventLuck + getGuildBonuses(game).eventLuck + getMasteryLevel(game, destination.id) * 0.015
  const pressure = (game.riskPressure ?? 0) * 0.008
  const conditionEffect = getRouteConditionEffect(routeCondition)
  const dangerPressure = clamp(0.08 + risk * 0.042 + game.day * 0.003 + pressure + conditionEffect.danger - totals.reputation * 0.014 - luck, 0.05, 0.48)
  const marketPressure = clamp(dangerPressure + 0.2 + Math.random() * 0.06, 0.28, 0.58)
  const lifePressure = marketPressure + 0.18
  const rewardPressure = lifePressure + 0.18
  const lossPressure = rewardPressure + 0.12
  const roll = Math.random()
  const discovery = createDiscoveryEvent(game, destination)

  if (discovery && Math.random() < 0.08 + luck * 0.5) return discovery
  if (Math.random() < 0.36) return createLocalEvent(game, destination, 'travel')

  if (roll < dangerPressure) {
    return { kind: 'battle', enemy: makeEnemy(risk, destination.id), text: `通往${destination.name}的路上出现了敌人。` }
  }

  if (roll < marketPressure) {
    const good = pick(GOODS)
    const surge = Math.random() > 0.5
    return {
      kind: 'market',
      goodId: good.id,
      factor: surge ? rand(132, 172) / 100 : rand(54, 76) / 100,
      text: surge ? `${destination.name}传出急购${good.name}的消息，行情上涨。` : `${good.name}货船集中抵达，价格短暂走低。`,
    }
  }

  if (roll < lifePressure) {
    const hp = rand(8, 20)
    const text = pick([
      `你在驿站睡了个好觉，恢复 ${hp} 点生命。`,
      `一位药师用月露替你处理伤口，恢复 ${hp} 点生命。`,
      `货车在安全营地停了一晚，恢复 ${hp} 点生命。`,
    ])
    return { kind: 'life', hp, text }
  }

  if (roll < rewardPressure) {
    const localNpc = pick(NPCS.filter((npc) => npc.location === destination.id).length ? NPCS.filter((npc) => npc.location === destination.id) : NPCS)
    const rewardEvents = [
      () => ({ kind: 'npc', npcId: localNpc.id, affection: rand(8, 14), text: `你在${destination.name}遇见${localNpc.role}${localNpc.name}。${localNpc.text}` }),
      () => {
        const gold = rand(50, 135)
        return { kind: 'reward', gold, rep: 1, text: `你替一支迷路小队指路，获得 ${gold} 金币和 1 点声望。` }
      },
      () => {
        const gold = rand(80, 185)
        return { kind: 'reward', gold, rep: 0, text: `商会委托你捎带密封账册，支付 ${gold} 金币。` }
      },
      () => {
        const good = pick(GOODS)
        return { kind: 'goods', goodId: good.id, amount: rand(1, 2), text: `神秘买家提前付订金，还送来 ${good.name} 样品。` }
      },
      () => {
        const good = pick(GOODS)
        return { kind: 'goods', goodId: good.id, amount: rand(2, 3), text: `宴会采购官付不起全款，改用 ${good.name} 抵账。` }
      },
      () => {
        const hp = rand(12, 24)
        const gold = rand(30, 90)
        return { kind: 'boon', hp, gold, rep: 1, text: `地方神殿请你转运圣烛，赠予 ${gold} 金币、治疗和 1 点声望。` }
      },
      () => ({ kind: 'meet', rep: rand(1, 2), text: '宴会采购官记住了你的商号，声望提高。' }),
    ]
    return pick(rewardEvents)()
  }

  if (roll < lossPressure) {
    const entries = Object.entries(game.inventory).filter(([, qty]) => qty > 0)
    if (Math.random() < 0.28) {
      const gold = Math.min(game.gold, rand(12, 48))
      return { kind: 'cost', gold, text: `临时税卡拦下车队，你支付 ${gold} 金币才获准通行。` }
    }
    if (!entries.length) {
      const gold = Math.min(game.gold, rand(18, 56))
      return { kind: 'cost', gold, text: `货车断轴，只能花 ${gold} 金币请工匠抢修。` }
    }
    const [goodId, qty] = pick(entries)
    const lost = Math.min(qty, rand(1, 2))
    const text = pick([
      `雨夜泥坡让货车翻了一角，损失 ${lost} 件${goodsById[goodId].name}。`,
      `港口抽检拖延了行程，${lost} 件${goodsById[goodId].name}被判定破损。`,
      `货车维修时少了一包货，损失 ${lost} 件${goodsById[goodId].name}。`,
    ])
    return { kind: 'loss', goodId, lost, text }
  }

  return pick([
    { kind: 'npc', npcId: pick(NPCS).id, affection: rand(6, 12), text: '一场偶然的对视让旅途多了一点让人心跳的余温。' },
    { kind: 'meet', rep: 2, text: '你与地方商会会长共饮一杯，拿到新的介绍信，声望提高。' },
    { kind: 'meet', rep: 1, text: '一位吟游诗人把你的商号写进新歌，声望提高。' },
    { kind: 'market', goodId: pick(GOODS).id, factor: rand(118, 148) / 100, text: '神秘买家放出大额订单，部分货物价格被抬高。' },
  ])
}

function createExploreEvent(game, routeCondition = game.routeCondition) {
  const location = locationsById[game.location]
  const risk = location.risk
  const roll = Math.random()
  const luck = getEquipmentPassives(game).eventLuck + getGuildBonuses(game).eventLuck + getMasteryLevel(game, location.id) * 0.015
  const conditionEffect = getRouteConditionEffect(routeCondition)
  const discovery = createDiscoveryEvent(game, location)
  if (discovery && Math.random() < 0.22 + luck) return discovery
  if (Math.random() < 0.44 + luck) return createLocalEvent(game, location, 'explore')
  if (roll < 0.24 + risk * 0.05 + (game.riskPressure ?? 0) * 0.006 + conditionEffect.danger - luck) return { kind: 'battle', enemy: makeEnemy(risk, location.id), text: `你深入${location.name}的偏僻角落，惊动了潜伏的敌人。` }
  if (roll < 0.45) {
    const rewards = generateRewards(risk, rand(15, 45), location.id)
    return { kind: 'loot', rewards, text: `你在${location.name}找到一处隐秘线索。` }
  }
  if (roll < 0.58) {
    const localNpc = pick(NPCS.filter((npc) => npc.location === location.id).length ? NPCS.filter((npc) => npc.location === location.id) : NPCS)
    return { kind: 'npc', npcId: localNpc.id, affection: rand(8, 16), text: `探索途中你遇见${localNpc.role}${localNpc.name}。${localNpc.text}` }
  }
  if (roll < 0.72) {
    const hp = rand(10, 26)
    return { kind: 'life', hp, text: `你找到一处安全歇脚点，恢复 ${hp} 点生命。` }
  }
  if (roll < 0.86) {
    const gold = rand(20, 95)
    return { kind: 'reward', gold, rep: risk >= 4 ? 1 : 0, text: `你完成一份本地委托，得到 ${gold} 金币。` }
  }
  const entries = Object.entries(game.inventory).filter(([, qty]) => qty > 0)
  if (entries.length && Math.random() < 0.55) {
    const [goodId, qty] = pick(entries)
    const lost = Math.min(qty, rand(1, 2))
    return { kind: 'loss', goodId, lost, text: `探索时货车留守不稳，损失 ${lost} 件${goodsById[goodId].name}。` }
  }
  const gold = Math.min(game.gold, rand(18, 70))
  return { kind: 'cost', gold, text: `探索路线比预想更糟，额外损耗 ${gold} 金币。` }
}

function updateRelationship(game, npcId, updater) {
  const current = { ...createEmptyRelationships()[npcId], ...(game.relationships?.[npcId] ?? {}) }
  const nextRel = updater({ ...current, met: true })
  return {
    ...game,
    relationships: { ...(game.relationships ?? createEmptyRelationships()), [npcId]: nextRel },
    knownNpcIds: game.knownNpcIds?.includes(npcId) ? game.knownNpcIds : [...(game.knownNpcIds ?? []), npcId],
  }
}

function applyEvent(game, event) {
  let next = { ...game, stats: { ...game.stats, events: game.stats.events + 1 } }

  if (event.kind === 'battle') {
    return addLog({ ...next, combat: event.enemy }, `${event.text} ${event.enemy.name}挡住了车队。`)
  }
  if (event.kind === 'market') {
    return addLog(
      { ...next, market: { ...next.market, [event.goodId]: Number(clamp((next.market[event.goodId] ?? 1) * event.factor, 0.48, 1.9).toFixed(2)) } },
      event.text,
    )
  }
  if (event.kind === 'life') {
    return addLog({ ...next, hp: next.hp + event.hp }, event.text)
  }
  if (event.kind === 'reward') {
    return addLog({ ...next, gold: next.gold + event.gold, reputation: next.reputation + event.rep }, event.text)
  }
  if (event.kind === 'boon') {
    return addLog(
      { ...next, gold: next.gold + event.gold, hp: next.hp + event.hp, reputation: next.reputation + event.rep },
      event.text,
    )
  }
  if (event.kind === 'goods') {
    return addLog(
      { ...next, inventory: { ...next.inventory, [event.goodId]: (next.inventory[event.goodId] ?? 0) + event.amount } },
      `${event.text} 获得 ${event.amount} 件${goodsById[event.goodId].name}。`,
    )
  }
  if (event.kind === 'loot') {
    return addLog(applyRewards(next, event.rewards), `${event.text} 获得 ${describeRewards(event.rewards)}。`)
  }
  if (event.kind === 'equipment') {
    const item = equipmentById[event.itemId]
    return addLog(applyRewards(next, [{ type: 'equipment', itemId: event.itemId }]), `${event.text} 获得 ${item.name}。`)
  }
  if (event.kind === 'discovery') {
    const landmark = LANDMARKS.find((item) => item.id === event.landmarkId)
    const location = locationsById[event.locationId]
    if (!landmark || !location) return addLog(next, '这条秘闻线索已经失效。')
    const discoveries = normalizeDiscoveries(next.discoveries)
    if (discoveries[event.locationId].includes(landmark.id)) {
      return addTaggedLog(next, '秘闻', `${location.name}的旧线索你已经记录在地图册里。`)
    }
    const rewards = landmark.rewards ?? []
    const discovered = applyRewards(
      {
        ...next,
        discoveries: { ...discoveries, [event.locationId]: [...discoveries[event.locationId], landmark.id] },
        riskPressure: clamp((next.riskPressure ?? 0) - 1, 0, 24),
        stats: { ...next.stats, landmarksFound: (next.stats.landmarksFound ?? 0) + 1 },
      },
      rewards,
    )
    return addTaggedLog(discovered, '秘闻', `${landmark.text} 发现地标：${landmark.name}。获得 ${describeRewards(rewards)}，风险压力 -1。`)
  }
  if (event.kind === 'faction') {
    const faction = FACTIONS.find((item) => item.id === event.factionId)
    return addLog(
      {
        ...next,
        gold: next.gold + (event.gold ?? 0),
        factions: { ...(next.factions ?? createInitialFactions()), [event.factionId]: (next.factions?.[event.factionId] ?? 0) + event.amount },
        stats: { ...next.stats, factionGain: (next.stats.factionGain ?? 0) + event.amount },
      },
      `${event.text} ${faction?.name ?? '本地势力'}好感 +${event.amount}${event.gold ? `，获得 ${event.gold} 金币` : ''}。`,
    )
  }
  if (event.kind === 'hurt') {
    return addLog({ ...next, hp: Math.max(1, next.hp - event.hp) }, `${event.text} 生命 -${event.hp}。`)
  }
  if (event.kind === 'rumor') {
    const rumors = createRumors(next.day)
    return addLog({ ...next, rumors }, `${event.text} ${rumors.map(describeRumor).join(' ')}`)
  }
  if (event.kind === 'pressure') {
    return addTaggedLog(
      { ...next, riskPressure: clamp((next.riskPressure ?? 0) + event.amount, 0, 24), stats: { ...next.stats, pressureCleared: (next.stats.pressureCleared ?? 0) + (event.amount < 0 ? Math.abs(event.amount) : 0) } },
      '风险',
      `${event.text} 风险压力 ${event.amount > 0 ? '+' : ''}${event.amount}。`,
    )
  }
  if (event.kind === 'cost') {
    return addLog({ ...next, gold: Math.max(0, next.gold - event.gold) }, event.text)
  }
  if (event.kind === 'npc') {
    const npc = npcById[event.npcId]
    const metBefore = next.relationships?.[event.npcId]?.met
    next = updateRelationship(next, event.npcId, (rel) => ({
      ...rel,
      affection: clamp(rel.affection + event.affection, 0, 100),
      stage: relationStage({ ...rel, affection: clamp(rel.affection + event.affection, 0, 100) }),
    }))
    const intro = metBefore ? `${npc.name}又与你同行了一段路。` : `人物结识：${npc.name}加入人物关系。`
    return addLog(next, `${intro}${event.text} 好感 +${event.affection}。`)
  }
  if (event.kind === 'loss') {
    const current = next.inventory[event.goodId] ?? 0
    return addLog(
      { ...next, inventory: { ...next.inventory, [event.goodId]: Math.max(0, current - event.lost) } },
      event.text,
    )
  }
  return addLog({ ...next, reputation: next.reputation + event.rep }, event.text)
}

function encodeSave(game) {
  const payload = {
    version: VERSION,
    day: game.day,
    location: game.location,
    gold: game.gold,
    hp: game.hp,
    baseMaxHp: game.baseMaxHp,
    baseAttack: game.baseAttack,
    baseDefense: game.baseDefense,
    reputation: game.reputation,
    baseCapacity: game.baseCapacity,
    background: game.background,
    inventory: game.inventory,
    equipmentOwned: game.equipmentOwned,
    equipped: game.equipped,
    market: game.market,
    rumors: game.rumors,
    worldNews: game.worldNews,
    routeCondition: game.routeCondition,
    localScene: game.localScene,
    commissions: game.commissions,
    routeContract: game.routeContract,
    activeRouteContract: game.activeRouteContract,
    factions: game.factions,
    guild: game.guild,
    locationMastery: game.locationMastery,
    discoveries: game.discoveries,
    riskPressure: game.riskPressure,
    activeAssist: game.activeAssist,
    relationships: game.relationships,
    knownNpcIds: game.knownNpcIds,
    partners: game.partners,
    stats: game.stats,
    achievements: game.achievements,
    log: game.log.slice(0, 80),
  }
  return btoa(unescape(encodeURIComponent(JSON.stringify(payload))))
}

function decodeSave(text) {
  const payload = JSON.parse(decodeURIComponent(escape(atob(text.trim()))))
  if (payload.version !== VERSION || !locationsById[payload.location] || typeof payload.gold !== 'number') {
    throw new Error('存档版本或基础字段无效。')
  }
  const base = createInitialGame()
  const normalizedEquipment = normalizeEquipmentState(payload)
  const factions = { ...createInitialFactions(), ...(payload.factions ?? {}) }
  return finish({
    ...base,
    ...payload,
    ...normalizedEquipment,
    rumors: Array.isArray(payload.rumors) ? payload.rumors : createRumors(payload.day ?? 1),
    worldNews: Array.isArray(payload.worldNews) ? payload.worldNews : createWorldNews(payload.day ?? 1),
    routeCondition: payload.routeCondition ?? createRouteCondition(payload.day ?? 1, payload.location),
    localScene: payload.localScene ?? createLocalScene(payload.day ?? 1, payload.location),
    commissions: Array.isArray(payload.commissions) ? payload.commissions : createCommissions(payload.location, payload.day ?? 1),
    routeContract: payload.routeContract ?? createRouteContract(payload.location, payload.day ?? 1),
    activeRouteContract: payload.activeRouteContract ?? null,
    factions,
    guild: normalizeGuild(payload.guild),
    locationMastery: normalizeLocationMastery(payload.locationMastery),
    discoveries: normalizeDiscoveries(payload.discoveries),
    riskPressure: payload.riskPressure ?? 0,
    activeAssist: payload.activeAssist ?? null,
    relationships: normalizeRelationships(payload.relationships),
    knownNpcIds: Array.isArray(payload.knownNpcIds) ? payload.knownNpcIds : [],
    partners: Array.isArray(payload.partners) ? payload.partners : [],
    stats: normalizeStats(base.stats, payload.stats),
    combat: null,
    gameOver: false,
    log: [`第 ${payload.day ?? base.day} 天：已从导入文本恢复存档。`, ...(Array.isArray(payload.log) ? payload.log : [])].slice(0, 120),
  })
}

function App() {
  const [game, setGame] = useState(createInitialGame)
  const [saveText, setSaveText] = useState('')
  const [saveError, setSaveError] = useState('')
  const [selectedNpcId, setSelectedNpcId] = useState(null)
  const [activeTab, setActiveTab] = useState('trade')
  const totals = useMemo(() => getTotals(game), [game])
  const cargoUsed = useMemo(() => getCargoUsed(game), [game])
  const currentLocation = locationsById[game.location]
  const canAct = !game.combat && !game.gameOver
  const latestEvent = game.log.find((entry) => !String(entry).includes('成就解锁：')) ?? game.log[0]
  const logGroups = useMemo(() => groupLogsByDay(game.log ?? []), [game.log])
  const todayFocus = useMemo(() => getTodayFocus(game), [game])
  const currentDiscoveries = getDiscoveredLandmarks(game, game.location)
  const currentDiscoveryTotal = landmarksByLocation[game.location]?.length ?? 0
  const knownNpcs = (game.knownNpcIds ?? []).map((id) => npcById[id]).filter(Boolean)
  const activeNpc = npcById[selectedNpcId] ?? knownNpcs[0]
  const activeRel = activeNpc ? game.relationships?.[activeNpc.id] : null
  const activeNpcInteractedToday = Boolean(activeRel && (activeRel.lastInteractionDay ?? 0) === game.day)
  const tabs = [
    ['trade', '跑商'],
    ['adventure', '冒险'],
    ['people', '人物'],
    ['role', '角色'],
    ['equipment', '装备'],
    ['records', '记录'],
  ]

  const commit = (updater) => {
    setGame((current) => finish(typeof updater === 'function' ? updater(current) : updater))
  }

  const buyGood = (goodId, amount = 1) => {
    if (!canAct) return
    commit((current) => {
      const good = goodsById[goodId]
      const price = getPrice(current, goodId, 'buy') * amount
      const free = getTotals(current).capacity - getCargoUsed(current)
      if (current.gold < price) return addLog(current, `金币不足，无法买入 ${amount} 件${good.name}。`)
      if (free < good.weight * amount) return addLog(current, `货舱空间不足，无法装下 ${amount} 件${good.name}。`)
      return addTaggedLog(
        awardGuild(addLocationMastery({
          ...current,
          gold: current.gold - price,
          inventory: { ...current.inventory, [goodId]: (current.inventory[goodId] ?? 0) + amount },
          stats: {
            ...current.stats,
            trades: current.stats.trades + 1,
            goodsMoved: current.stats.goodsMoved + amount,
            profit: current.stats.profit - price,
          },
        }, current.location, 'trades', amount), 'trade', Math.max(4, Math.round(price / 35))),
        '交易',
        `买入 ${amount} 件${good.name}，花费 ${price} 金币。`,
      )
    })
  }

  const sellGood = (goodId, amount = 1) => {
    if (!canAct) return
    commit((current) => {
      const have = current.inventory[goodId] ?? 0
      const good = goodsById[goodId]
      if (have < amount) return addLog(current, `${good.name}库存不足，无法出售。`)
      const revenue = getPrice(current, goodId, 'sell') * amount
      return addTaggedLog(
        awardGuild(addLocationMastery({
          ...current,
          gold: current.gold + revenue,
          inventory: { ...current.inventory, [goodId]: have - amount },
          reputation: current.reputation + (revenue >= 500 ? 1 : 0),
          stats: {
            ...current.stats,
            trades: current.stats.trades + 1,
            goodsMoved: current.stats.goodsMoved + amount,
            profit: current.stats.profit + revenue,
          },
        }, current.location, 'trades', amount), 'trade', Math.max(5, Math.round(revenue / 30))),
        '交易',
        `卖出 ${amount} 件${good.name}，收入 ${revenue} 金币。`,
      )
    })
  }

  const travelTo = (locationId) => {
    if (!canAct || locationId === game.location) return
    commit((current) => {
      const destination = locationsById[locationId]
      const assist = getAssist(current)
      const passives = getEquipmentPassives(current)
      const guildBonuses = getGuildBonuses(current)
      const conditionEffect = getRouteConditionEffect(current.routeCondition)
      const masteryDiscount = Math.min(getMasteryLevel(current, locationId) * 0.025, 0.1)
      const factionFavor = getFactionFavorBonus(current, locationId)
      const costFactor = Math.max(0.62, (assist?.type === 'route' ? 0.8 : 1) - passives.routeDiscount - guildBonuses.routeDiscount - masteryDiscount - factionFavor.tradeBonus)
      const travelCost = Math.max(6, Math.round((Math.round(destination.cost * 0.82) + Math.max(0, destination.risk - getTotals(current).reputation) * 2) * costFactor * conditionEffect.travelCost))
      if (current.gold < travelCost) return addLog(current, `前往${destination.name}至少需要 ${travelCost} 金币路费。`)
      const dayUpdates = advanceDay(current, current.day + 1, locationId)
      const newsText = dayUpdates.worldNews ? ` ${dayUpdates.worldNews.map(describeWorldNews).join(' ')}` : ''
      const routeText = ` ${describeRouteCondition(dayUpdates.routeCondition)}`
      const sceneText = ` ${describeLocalScene(dayUpdates.localScene)}`
      const moved = addLog(
        awardGuild(addLocationMastery({
          ...current,
          ...dayUpdates,
          location: locationId,
          gold: current.gold - travelCost,
          market: rollMarket(locationId, dayUpdates.rumors, dayUpdates.worldNews ?? current.worldNews ?? [], dayUpdates.localScene),
          riskPressure: clamp((current.riskPressure ?? 0) + destination.risk + conditionEffect.pressure + (dayUpdates.localScene?.pressure ?? 0) - Math.floor(getTotals(current).reputation / 5) - factionFavor.pressureRelief, 0, 24),
          stats: {
            ...current.stats,
            travels: current.stats.travels + 1,
            extremeSurvivals: (current.stats.extremeSurvivals ?? 0) + (destination.risk >= 5 ? 1 : 0),
          },
        }, locationId, 'explores', 1), 'explore', 14 + destination.risk * 3),
        `第 ${current.day + 1} 天，你抵达${destination.name}，支付路费 ${travelCost} 金币。${assist?.type === 'route' ? ' 同行协助替你压低了一段路费。' : ''}${routeText}${sceneText}${newsText}`,
      )
      return maybePartnerEvent(applyEvent(moved, createTravelEvent(current, destination, current.routeCondition)))
    })
  }

  const exploreLocation = () => {
    if (!canAct) return
    commit((current) => {
      const location = locationsById[current.location]
      const assist = getAssist(current)
      const passives = getEquipmentPassives(current)
      const guildBonuses = getGuildBonuses(current)
      const conditionEffect = getRouteConditionEffect(current.routeCondition)
      const masteryDiscount = Math.min(getMasteryLevel(current, current.location) * 0.03, 0.12)
      const factionFavor = getFactionFavorBonus(current, current.location)
      const costFactor = Math.max(0.58, (assist?.type === 'scout' ? 0.78 : 1) - passives.exploreDiscount - guildBonuses.exploreDiscount - masteryDiscount - factionFavor.tradeBonus)
      const exploreCost = Math.max(10, Math.round((12 + location.risk * 8 - getTotals(current).reputation) * costFactor * conditionEffect.exploreCost))
      if (current.gold < exploreCost) return addLog(current, `探索${location.name}需要 ${exploreCost} 金币准备补给。`)
      const dayUpdates = advanceDay(current, current.day + 1, current.location)
      const newsText = dayUpdates.worldNews ? ` ${dayUpdates.worldNews.map(describeWorldNews).join(' ')}` : ''
      const routeText = ` ${describeRouteCondition(dayUpdates.routeCondition)}`
      const sceneText = ` ${describeLocalScene(dayUpdates.localScene)}`
      const explored = addLog(
        awardGuild(addLocationMastery({
          ...current,
          ...dayUpdates,
          gold: current.gold - exploreCost,
          market: rollMarket(current.location, dayUpdates.rumors, dayUpdates.worldNews ?? current.worldNews ?? [], dayUpdates.localScene),
          riskPressure: clamp((current.riskPressure ?? 0) + location.risk + 1 + conditionEffect.pressure + (dayUpdates.localScene?.pressure ?? 0) - getMasteryLevel(current, current.location) - factionFavor.pressureRelief, 0, 24),
          stats: {
            ...current.stats,
            explores: (current.stats.explores ?? 0) + 1,
            extremeSurvivals: (current.stats.extremeSurvivals ?? 0) + (location.risk >= 5 ? 1 : 0),
          },
        }, current.location, 'explores', 1), 'explore', 18 + location.risk * 4),
        `第 ${current.day + 1} 天，你花费 ${exploreCost} 金币探索${location.name}。${assist?.type === 'scout' ? ' 同伴提前探路，补给消耗降低。' : ''}${routeText}${sceneText}${newsText}`,
      )
      return maybePartnerEvent(applyEvent(explored, createExploreEvent(current, current.routeCondition)))
    })
  }

  const buyEquipment = (itemId) => {
    if (!canAct) return
    commit((current) => {
      const item = equipmentById[itemId]
      if (!item || item.source !== 'shop') return addLog(current, '这件装备不在工坊出售。')
      if (current.gold < item.price) return addLog(current, `金币不足，无法购买${item.name}。`)
      return addLog(
        { ...current, gold: current.gold - item.price, equipmentOwned: [...(current.equipmentOwned ?? []), createEquipmentInstance(itemId)] },
        `购买装备：${item.name}。`,
      )
    })
  }

  const equipItem = (uid) => {
    if (!canAct) return
    commit((current) => {
      const instance = (current.equipmentOwned ?? []).find((owned) => owned.uid === uid)
      const item = getEquipmentItem(instance)
      if (!item) return current
      return addLog({ ...current, equipped: { ...current.equipped, [item.slot]: uid } }, `已装备${item.name}。`)
    })
  }

  const sellEquipment = (uid) => {
    if (!canAct) return
    commit((current) => {
      const instance = (current.equipmentOwned ?? []).find((owned) => owned.uid === uid)
      const item = getEquipmentItem(instance)
      if (!item) return current
      if (Object.values(current.equipped).includes(uid)) return addLog(current, `请先换下${item.name}再出售。`)
      const revenue = getEquipmentSellPrice(current, item)
      return addLog(
        {
          ...current,
          gold: current.gold + revenue,
          equipmentOwned: (current.equipmentOwned ?? []).filter((owned) => owned.uid !== uid),
        },
        `在${locationsById[current.location].name}出售${item.name}，回收 ${revenue} 金币。`,
      )
    })
  }

  const acceptRouteContract = () => {
    if (!canAct) return
    commit((current) => {
      if (current.activeRouteContract) return addTaggedLog(current, '商单', '已有跨城商单在途，先完成或放弃后再接新单。')
      const contract = current.routeContract ?? createRouteContract(current.location, current.day)
      return addTaggedLog(
        { ...current, activeRouteContract: { ...contract, acceptedDay: current.day }, routeContract: null },
        '商单',
        `接下跨城商单：${describeRouteContract(contract)} 奖励 ${contract.rewardGold} 金币。`,
      )
    })
  }

  const completeRouteContract = () => {
    if (!canAct) return
    commit((current) => {
      const contract = current.activeRouteContract
      if (!contract) return current
      const status = getRouteContractStatus(current, contract)
      const target = locationsById[contract.targetId]
      const good = goodsById[contract.goodId]
      if (!['可完成', '可逾期交付，奖励降低'].includes(status)) {
        return addTaggedLog(current, '商单', `跨城商单尚未完成：${status}。`)
      }
      const have = current.inventory[contract.goodId] ?? 0
      const late = current.day > contract.deadline
      const rewardScale = 1 + getEquipmentPassives(current).commissionBonus + getGuildBonuses(current).commissionBonus + getFactionFavorBonus(current, contract.targetId).commissionBonus
      const rewardGold = Math.round(contract.rewardGold * rewardScale * (late ? 0.45 : 1))
      const factionGain = late ? 0 : 1
      const factionId = contract.factionId
      const next = awardGuild(addLocationMastery({
        ...current,
        gold: current.gold + rewardGold,
        inventory: { ...current.inventory, [contract.goodId]: have - contract.amount },
        routeContract: createRouteContract(current.location, current.day),
        activeRouteContract: null,
        factions: factionId ? { ...(current.factions ?? createInitialFactions()), [factionId]: (current.factions?.[factionId] ?? 0) + factionGain } : current.factions,
        stats: {
          ...current.stats,
          trades: current.stats.trades + 1,
          goodsMoved: current.stats.goodsMoved + contract.amount,
          profit: current.stats.profit + rewardGold,
          routeContractsDone: (current.stats.routeContractsDone ?? 0) + 1,
          factionGain: (current.stats.factionGain ?? 0) + factionGain,
        },
      }, contract.targetId, 'trades', contract.amount), 'trade', late ? 16 : 36 + contract.amount * 8)
      return addTaggedLog(
        next,
        '商单',
        `${late ? '逾期交付' : '完成跨城商单'}：向${target?.name ?? '目的地'}交付 ${good?.name ?? '货物'} ×${contract.amount}，获得 ${rewardGold} 金币${factionGain ? '和目的地势力好感 +1' : '，但逾期未增加势力好感'}。`,
      )
    })
  }

  const abandonRouteContract = () => {
    if (!canAct) return
    commit((current) => {
      if (!current.activeRouteContract) return current
      const contract = current.activeRouteContract
      const target = locationsById[contract.targetId]
      return addTaggedLog(
        {
          ...current,
          activeRouteContract: null,
          routeContract: createRouteContract(current.location, current.day),
          reputation: Math.max(0, current.reputation - 1),
        },
        '商单',
        `放弃发往${target?.name ?? '目的地'}的跨城商单，商路信誉暂时受损，声望 -1。`,
      )
    })
  }

  const completeCommission = (commissionId) => {
    if (!canAct) return
    commit((current) => {
      const commission = (current.commissions ?? []).find((item) => item.id === commissionId)
      if (!commission) return current
      const remaining = (current.commissions ?? []).filter((item) => item.id !== commissionId)
      const rewardScale = 1 + getEquipmentPassives(current).commissionBonus + getGuildBonuses(current).commissionBonus + getFactionFavorBonus(current, commission.locationId).commissionBonus + getMasteryLevel(current, commission.locationId) * 0.025
      const rewardGold = Math.round(commission.rewardGold * rewardScale)
      const factionId = commission.factionId
      const rewardBase = (state, route = 'trade') => awardGuild(addLocationMastery({
        ...state,
        gold: state.gold + rewardGold,
        commissions: remaining,
        factions: { ...(state.factions ?? createInitialFactions()), [factionId]: (state.factions?.[factionId] ?? 0) + 1 },
        stats: { ...state.stats, commissionsDone: (state.stats.commissionsDone ?? 0) + 1, factionGain: (state.stats.factionGain ?? 0) + 1 },
      }, commission.locationId, route === 'social' ? 'social' : route === 'combat' ? 'battles' : 'trades', 1), route, 26 + commission.locationId.length)

      if (commission.type === 'delivery') {
        const have = current.inventory[commission.goodId] ?? 0
        if (have < commission.amount) return addLog(current, `委托尚未完成：需要 ${goodsById[commission.goodId].name} ×${commission.amount}。`)
        return addTaggedLog(
          rewardBase({ ...current, inventory: { ...current.inventory, [commission.goodId]: have - commission.amount } }, 'trade'),
          '委托',
          `完成交货委托，交出 ${goodsById[commission.goodId].name} ×${commission.amount}，获得 ${rewardGold} 金币和本地势力好感。`,
        )
      }

      if (commission.type === 'survey') {
        if (current.gold < commission.cost) return addLog(current, `委托尚未完成：需要 ${commission.cost} 金币准备费。`)
        return addTaggedLog(
          rewardBase({ ...current, gold: current.gold - commission.cost, riskPressure: Math.max(0, (current.riskPressure ?? 0) - 2) }, 'explore'),
          '委托',
          `完成勘探委托，扣除 ${commission.cost} 金币准备费，获得 ${rewardGold} 金币并降低风险压力。`,
        )
      }

      if (commission.type === 'social') {
        const npc = npcById[commission.npcId]
        if (!current.relationships?.[commission.npcId]?.met) return addLog(current, `委托尚未完成：需要先结识${npc.name}。`)
        const withReward = rewardBase(current, 'social')
        return addTaggedLog(
          updateRelationship(withReward, commission.npcId, (rel) => ({
            ...rel,
            affection: clamp(rel.affection + 8 + getEquipmentPassives(current).socialBonus, 0, 100),
            interactions: rel.interactions + 1,
            stage: relationStage({ ...rel, affection: clamp(rel.affection + 8, 0, 100) }),
          })),
          '委托',
          `完成拜访委托，${npc.name}记住了你的周到，获得 ${rewardGold} 金币和好感。`,
        )
      }

      const enemy = makeEnemy(locationsById[commission.locationId].risk, commission.locationId)
      return addTaggedLog(
        awardGuild(addLocationMastery({
          ...current,
          commissions: remaining,
          stats: { ...current.stats, commissionsDone: (current.stats.commissionsDone ?? 0) + 1 },
          combat: { ...enemy, gold: enemy.gold + rewardGold },
        }, commission.locationId, 'battles', 1), 'combat', 18 + locationsById[commission.locationId].risk * 4),
        '委托',
        `接下悬赏委托：${enemy.name}已经现身，胜利后会把委托赏金一并结算。`,
      )
    })
  }

  const restAtLocation = () => {
    if (!canAct) return
    commit((current) => {
      const location = locationsById[current.location]
      const cost = Math.min(current.gold, Math.max(18, 30 + location.risk * 6 - getMasteryLevel(current, current.location) * 3))
      const healed = rand(18, 34)
      return addTaggedLog(
        awardGuild({
          ...current,
          gold: current.gold - cost,
          hp: current.hp + healed,
          riskPressure: Math.max(0, (current.riskPressure ?? 0) - 5),
          stats: { ...current.stats, pressureCleared: (current.stats.pressureCleared ?? 0) + 5 },
        }, 'explore', 8),
        '休整',
        `你在${location.name}休整车队，花费 ${cost} 金币，恢复 ${healed} 生命，风险压力明显下降。`,
      )
    })
  }

  const combatAction = (action) => {
    commit((current) => {
      if (!current.combat) return current
      const player = getTotals(current)
      let next = { ...current }
      let enemy = { ...current.combat }
      const messages = []

      if (action === 'heal') {
        const herbs = current.inventory.herb ?? 0
        if (!herbs) return addLog(current, '没有银叶药草，无法治疗。')
        next = {
          ...next,
          hp: clamp(next.hp + 25, 0, player.maxHp),
          inventory: { ...next.inventory, herb: herbs - 1 },
        }
        messages.push('你嚼碎银叶药草，恢复 25 点生命。')
      }

      if (action === 'escape') {
        if (Math.random() < 0.72) return addLog({ ...next, combat: null }, '你抛出烟罐撤离战场，保住了货车。')
        messages.push('撤离失败，敌人追了上来。')
      }

      if (action === 'attack') {
        const damage = Math.max(3, rand(player.attack - 2, player.attack + 7) - Math.floor(enemy.defense / 2))
        enemy = { ...enemy, hp: enemy.hp - damage }
        messages.push(`你造成 ${damage} 点伤害。`)
      }

      if (enemy.hp <= 0) {
        const rewards = generateRewards(enemy.risk ?? 1, enemy.gold, enemy.locationId ?? current.location)
        const rewarded = applyRewards(next, rewards)
        return addTaggedLog(
          awardGuild(addLocationMastery({
            ...rewarded,
            reputation: rewarded.reputation + enemy.rep,
            combat: null,
            riskPressure: Math.max(0, (rewarded.riskPressure ?? 0) - 2),
            stats: { ...rewarded.stats, battlesWon: rewarded.stats.battlesWon + 1 },
          }, enemy.locationId ?? current.location, 'battles', 1), 'combat', 24 + (enemy.risk ?? 1) * 5),
          '战斗',
          `${messages.join(' ')} 击败${enemy.name}，获得 ${describeRewards(rewards)}，以及 ${enemy.rep} 点声望。`,
        )
      }

      const assist = getAssist(current)
      const incomingBase = Math.max(1, rand(enemy.attack - 5, enemy.attack + 2) - Math.floor(player.defense * 0.65))
      const reduction = (assist?.type === 'guard' ? 0.22 : 0) + getEquipmentPassives(current).combatReduction + getGuildBonuses(current).combatReduction
      const incoming = Math.max(1, Math.round(incomingBase * Math.max(0.55, 1 - reduction)))
      const hp = next.hp - incoming
      messages.push(`${enemy.name}反击，造成 ${incoming} 点伤害。${assist?.type === 'guard' ? ' 同伴替你挡下了一部分冲击。' : ''}`)
      if (hp <= 0) {
        return addLog({ ...next, hp: 0, combat: null, gameOver: true }, `${messages.join(' ')} 你倒在旅途中，本局结束。`)
      }
      return addLog({ ...next, hp, combat: enemy }, messages.join(' '))
    })
  }

  const socialAction = (npcId, action) => {
    if (!canAct) return
    commit((current) => {
      const npc = npcById[npcId]
      if (!npc || !current.relationships?.[npcId]?.met) return addLog(current, '你还没有正式结识这位人物。')
      const rel = { ...createEmptyRelationships()[npcId], ...current.relationships[npcId] }
      if ((rel.lastInteractionDay ?? 0) === current.day) return addLog(current, `今天已经和${npc.name}互动过了，明天再来。`)
      const socialStats = { ...current.stats, socialActions: current.stats.socialActions + 1 }
      const markSocial = (nextGame) => ({
        ...nextGame,
        relationships: {
          ...(nextGame.relationships ?? {}),
          [npcId]: { ...(nextGame.relationships?.[npcId] ?? rel), lastInteractionDay: current.day },
        },
      })

      if (action === 'talk') {
        const gain = rand(6, 10) + getEquipmentPassives(current).socialBonus + getGuildBonuses(current).socialBonus
        const line = npcLine(npc, 'talk', rel)
        return markSocial(addLog(
          updateRelationship(awardGuild(addLocationMastery({ ...current, stats: socialStats }, current.location, 'social', 1), 'social', 8 + gain), npcId, (nextRel) => ({
            ...nextRel,
            affection: clamp(nextRel.affection + gain, 0, 100),
            interactions: nextRel.interactions + 1,
            stage: relationStage({ ...nextRel, affection: clamp(nextRel.affection + gain, 0, 100) }),
          })),
          `${line} 好感 +${gain}。`,
        ))
      }

      if (action === 'date') {
        const cost = Math.min(current.gold, rand(28, 72))
        const gain = (rel.affection >= 70 ? rand(20, 30) : rand(14, 22)) + getEquipmentPassives(current).socialBonus + getGuildBonuses(current).socialBonus
        const line = npcLine(npc, 'date', rel)
        const dayUpdates = advanceDay(current, current.day + 1)
        return markSocial(addLog(
          updateRelationship(
            awardGuild(addLocationMastery({ ...current, ...dayUpdates, gold: current.gold - cost, stats: { ...socialStats, dates: current.stats.dates + 1 } }, current.location, 'social', 2), 'social', 14 + gain),
            npcId,
            (nextRel) => ({
              ...nextRel,
              affection: clamp(nextRel.affection + gain, 0, 100),
              dates: nextRel.dates + 1,
              interactions: nextRel.interactions + 1,
              stage: relationStage({ ...nextRel, affection: clamp(nextRel.affection + gain, 0, 100) }),
            }),
          ),
          `${line} 花费 ${cost} 金币，好感 +${gain}。`,
        ))
      }

      if (action === 'gift') {
        const giftId = npc.likes.find((id) => (current.inventory[id] ?? 0) > 0) ?? Object.entries(current.inventory).find(([, qty]) => qty > 0)?.[0]
        if (!giftId) return addLog(current, '货舱里没有适合送出的礼物。')
        const preferred = npc.likes.includes(giftId)
        const gain = (preferred ? rand(16, 25) : rand(7, 12)) + getEquipmentPassives(current).socialBonus + getGuildBonuses(current).socialBonus
        const line = preferred ? npc.lines.giftGood : npc.lines.giftNormal
        return markSocial(addLog(
          updateRelationship(
            awardGuild(addLocationMastery({
              ...current,
              inventory: { ...current.inventory, [giftId]: current.inventory[giftId] - 1 },
              stats: { ...socialStats, gifts: current.stats.gifts + 1 },
            }, current.location, 'social', 1), 'social', 9 + gain),
            npcId,
            (nextRel) => ({
              ...nextRel,
              affection: clamp(nextRel.affection + gain, 0, 100),
              gifts: nextRel.gifts + 1,
              interactions: nextRel.interactions + 1,
              stage: relationStage({ ...nextRel, affection: clamp(nextRel.affection + gain, 0, 100) }),
            }),
          ),
          `${line} 送出 ${goodsById[giftId].name}，好感 +${gain}。`,
        ))
      }

      if (action === 'cooperate') {
        const gain = rand(8, 14) + getEquipmentPassives(current).socialBonus + getGuildBonuses(current).socialBonus
        let next = updateRelationship(awardGuild(addLocationMastery({ ...current, stats: socialStats }, current.location, 'social', 1), 'social', 12 + gain), npcId, (nextRel) => ({
          ...nextRel,
          affection: clamp(nextRel.affection + gain, 0, 100),
          cooperations: nextRel.cooperations + 1,
          interactions: nextRel.interactions + 1,
          stage: relationStage({ ...nextRel, affection: clamp(nextRel.affection + gain, 0, 100) }),
        }))
        if (npc.id === 'selene') next = { ...next, hp: next.hp + 30 }
        if (npc.id === 'mira') {
          const newRumors = createRumors(next.day)
          next = { ...next, rumors: newRumors, log: [...newRumors.map((rumor) => formatLogEntry(next, describeRumor(rumor))), ...next.log].slice(0, 120) }
        }
        if (npc.id === 'oran') next = { ...next, baseCapacity: next.baseCapacity + 1 }
        if (npc.id === 'rhea') next = { ...next, inventory: { ...next.inventory, relic: (next.inventory.relic ?? 0) + 1 } }
        if (npc.id === 'lina') next = { ...next, gold: next.gold + rand(60, 120) }
        if (npc.id === 'kael') next = { ...next, hp: next.hp + 18 }
        if (npc.id === 'naya') next = { ...next, reputation: next.reputation + 1 }
        if (npc.id === 'avel') next = { ...next, reputation: next.reputation + 2 }
        return markSocial(addLog(next, `${npc.cooperate} 你们靠得很近地商量细节，好感 +${gain}。`))
      }

      if (action === 'assist') {
        if (rel.affection < 25) return addLog(current, `${npc.name}还需要更信任你，好感至少 25 才愿意长期同行协助。`)
        const cost = Math.min(current.gold, Math.max(40, 105 - rel.affection))
        const type = getNpcAssistType(npc.id)
        const gain = rand(5, 9)
        const assistText = {
          route: `${npc.name}替你安排路线和落脚点，接下来几天路费会降低。`,
          scout: `${npc.name}提前探查街巷、密林和传闻，接下来几天探索更省补给。`,
          guard: `${npc.name}答应贴身护卫车队，接下来几天战斗伤害会降低。`,
          bargain: `${npc.name}替你出面谈价，接下来几天买卖会更占便宜。`,
        }[type]
        return markSocial(addLog(
          updateRelationship(
            {
              ...current,
              gold: current.gold - cost,
              activeAssist: { npcId: npc.id, type, expiresDay: current.day + 3 },
              stats: { ...socialStats, companionHelps: (current.stats.companionHelps ?? 0) + 1 },
            },
            npcId,
            (nextRel) => ({
              ...nextRel,
              affection: clamp(nextRel.affection + gain, 0, 100),
              interactions: nextRel.interactions + 1,
              stage: relationStage({ ...nextRel, affection: clamp(nextRel.affection + gain, 0, 100) }),
            }),
          ),
          `${assistText} 花费 ${cost} 金币，好感 +${gain}。`,
        ))
      }

      if (action === 'quest') {
        if (rel.affection < 35) return addLog(current, `${npc.name}还没有把真正麻烦的事交给你，好感至少 35 才能共同任务。`)
        const outcome = createNpcQuestOutcome(current, npc, rel)
        let next = {
          ...current,
          gold: current.gold + (outcome.gold ?? 0),
          hp: current.hp + (outcome.hp ?? 0),
          reputation: current.reputation + (outcome.reputation ?? 0),
          baseCapacity: current.baseCapacity + (outcome.capacity ?? 0),
          riskPressure: clamp((current.riskPressure ?? 0) + (outcome.pressure ?? 0), 0, 24),
          stats: { ...socialStats, npcQuests: (current.stats.npcQuests ?? 0) + 1 },
        }
        if (outcome.goodId) next = { ...next, inventory: { ...next.inventory, [outcome.goodId]: (next.inventory[outcome.goodId] ?? 0) + outcome.amount } }
        if (outcome.equipmentId) next = applyRewards(next, [{ type: 'equipment', itemId: outcome.equipmentId }])
        if (outcome.factionId) {
          next = {
            ...next,
            factions: { ...(next.factions ?? createInitialFactions()), [outcome.factionId]: (next.factions?.[outcome.factionId] ?? 0) + 1 },
            stats: { ...next.stats, factionGain: (next.stats.factionGain ?? 0) + 1 },
          }
        }
        if (outcome.rumors) next = { ...next, rumors: createRumors(next.day, getEquipmentPassives(next).rumorBonus) }
        next = awardGuild(addLocationMastery(next, current.location, 'social', 2), 'social', 24 + outcome.gain)
        return markSocial(addTaggedLog(
          updateRelationship(next, npcId, (nextRel) => ({
            ...nextRel,
            affection: clamp(nextRel.affection + outcome.gain, 0, 100),
            interactions: nextRel.interactions + 1,
            stage: relationStage({ ...nextRel, affection: clamp(nextRel.affection + outcome.gain, 0, 100) }),
          })),
          '人物',
          `${outcome.text} 好感 +${outcome.gain}。`,
        ))
      }

      if (action === 'confess') {
        if (rel.confessed) return addLog(current, `${npc.name}已经接受过你的表白。`)
        if (rel.affection < 45) return addLog(current, `${npc.name}还在试探你的真心，好感至少 45 才适合表白。`)
        const line = npc.lines.confess
        return markSocial(addLog(
          updateRelationship({ ...current, stats: socialStats }, npcId, (nextRel) => ({
            ...nextRel,
            confessed: true,
            affection: clamp(nextRel.affection + 8, 0, 100),
            interactions: nextRel.interactions + 1,
            stage: '恋人',
          })),
          line,
        ))
      }

      if (action === 'marry') {
        if (rel.married) return addLog(current, `你与${npc.name}已经是伴侣。`)
        if (!rel.confessed || rel.affection < 75) return addLog(current, `与${npc.name}结婚需要先表白，并让好感达到 75。`)
        const cost = 160
        if (current.gold < cost) return addLog(current, `准备婚约和宴席需要 ${cost} 金币。`)
        const line = npc.lines.marry
        return markSocial(addLog(
          updateRelationship(
            { ...current, gold: current.gold - cost, partners: [...(current.partners ?? []), npcId], stats: socialStats },
            npcId,
            (nextRel) => ({ ...nextRel, married: true, affection: 100, stage: '伴侣', interactions: nextRel.interactions + 1 }),
          ),
          line,
        ))
      }

      return current
    })
  }

  const exportSave = () => {
    setSaveError('')
    setSaveText(encodeSave(game))
  }

  const importSave = () => {
    try {
      setGame(decodeSave(saveText))
      setSaveError('')
    } catch (error) {
      setSaveError(error instanceof Error ? error.message : '存档文本无法解析。')
    }
  }

  const resetGame = () => {
    setGame(createInitialGame())
    setSaveError('')
    setSaveText('')
  }

  return (
    <main className="app-shell">
      <header className="topbar">
        <div>
          <p className="eyebrow">奇幻商旅文字小游戏</p>
          <h1>白塔行商记</h1>
        </div>
        <div className="stat-grid" aria-label="角色状态">
          <Stat label="金币" value={game.gold} />
          <Stat label="生命" value={`${game.hp}/${totals.maxHp}`} />
          <Stat label="攻击" value={totals.attack} />
          <Stat label="防御" value={totals.defense} />
          <Stat label="声望" value={totals.reputation} />
          <Stat label="天数" value={game.day} />
          <Stat label="地点" value={currentLocation.name} />
          <Stat label="货舱" value={`${cargoUsed}/${totals.capacity}`} />
          <Stat label="商会" value={`${game.guild?.level ?? 1} 级`} />
          <Stat label="风险" value={game.riskPressure ?? 0} />
        </div>
      </header>

      <section className="latest-event" aria-live="polite">
        <span>最新事件</span>
        <strong>{latestEvent}</strong>
      </section>

      <nav className="tab-nav" aria-label="功能分页">
        {tabs.map(([id, label]) => (
          <button
            key={id}
            type="button"
            className={activeTab === id ? 'active' : ''}
            onClick={() => setActiveTab(id)}
          >
            {label}
          </button>
        ))}
      </nav>

      <section className={`today-focus ${activeTab === 'trade' ? 'is-active' : ''}`}>
        <span>今日重点</span>
        <strong>高价货：{todayFocus.bestGoods}</strong>
        <strong>路线：{todayFocus.route} · {todayFocus.mastery}</strong>
        <strong>路况：{todayFocus.condition}</strong>
        <strong>日势：{todayFocus.localScene}</strong>
        <strong>风险：{todayFocus.pressureText}</strong>
        <strong>{todayFocus.commission}</strong>
      </section>

      {game.gameOver && (
        <section className="alert-panel">
          <strong>旅程结束</strong>
          <span>生命归零后无法继续交易。你可以导出这局记录，或重新开局。</span>
          <button type="button" onClick={resetGame}>重新开局</button>
        </section>
      )}

      {game.combat && (
        <section className="combat-panel">
          <div>
            <p className="eyebrow">战斗事件</p>
            <h2>{game.combat.name}</h2>
            <p>敌方生命 {game.combat.hp}/{game.combat.maxHp}，攻击 {game.combat.attack}，防御 {game.combat.defense}</p>
          </div>
          <div className="button-row">
            <button type="button" onClick={() => combatAction('attack')}>攻击</button>
            <button type="button" onClick={() => combatAction('heal')}>使用药草</button>
            <button type="button" onClick={() => combatAction('escape')}>尝试逃跑</button>
          </div>
        </section>
      )}

      {activeTab === 'trade' && (
        <section className="location-hero">
          {locationArt[game.location] && <img src={locationArt[game.location]} alt="" />}
          <div>
            <p className="eyebrow">当前地点</p>
            <h2>{currentLocation.name}</h2>
            <span>{currentLocation.note}</span>
          </div>
        </section>
      )}

      <div className={`workbench view-${activeTab}`}>
        <div className="game-grid">
          <section className="panel travel-panel travel-route-panel">
          <PanelTitle kicker="路线" title="地点与旅行" />
          <div className="location-list">
            {LOCATIONS.map((location) => (
              <article
                key={location.id}
                className={`location-card ${location.id === game.location ? 'active' : ''}`}
              >
                {locationArt[location.id] && <img className="location-thumb" src={locationArt[location.id]} alt="" loading="lazy" />}
                <span>
                  <strong>{location.name}</strong>
                  <small>{location.note}</small>
                </span>
                <em className={`risk-tag ${riskLevel(location.risk)}`}>{riskLevel(location.risk)} · 风险 {location.risk} / 标准路费 {location.cost}</em>
                <small className="landmark-count">秘闻 {getDiscoveredLandmarks(game, location.id).length}/{landmarksByLocation[location.id]?.length ?? 0}</small>
                <div className="button-row compact location-actions">
                  <button type="button" disabled={!canAct || location.id === game.location} onClick={() => travelTo(location.id)}>前往</button>
                  <button type="button" disabled={!canAct || location.id !== game.location} onClick={exploreLocation}>探索</button>
                </div>
              </article>
            ))}
          </div>
          </section>

          <div className="center-stack">
            <section className="panel log-panel records-log-panel">
              <PanelTitle kicker="记录" title="事件日志" />
              <div className="log-list">
                {logGroups.map((group) => (
                  <section key={group.label} className="log-day">
                    <h3>{group.label}</h3>
                    {group.entries.map((entry, index) => {
                      const parsed = parseLogEntry(entry)
                      return (
                        <p key={`${entry}-${index}`}>
                          <span className={`log-tag tag-${parsed.tag}`}>{parsed.tag}</span>
                          {parsed.text}
                        </p>
                      )
                    })}
                  </section>
                ))}
              </div>
            </section>

            <section className="panel market-panel trade-market-panel">
            <PanelTitle kicker="交易" title="当地市场" />
            <div className="market-list">
              {GOODS.map((good) => {
                const buy = getPrice(game, good.id, 'buy')
                const sell = getPrice(game, good.id, 'sell')
                const owned = game.inventory[good.id] ?? 0
                const priceLabel = getPriceLabel(game, good.id)
                return (
                  <article key={good.id} className="market-row">
                    <div>
                      <strong className={`rarity-text rarity-${good.rarity}`}>{good.name}</strong>
                      <span>{good.type} · {describeRarity(good.rarity)} · 重量 {good.weight} · 持有 {owned}</span>
                      <small>{good.text}</small>
                      <small className={`price-tag ${priceLabel}`}>今日价位：{priceLabel}</small>
                    </div>
                    <div className="price-block">
                      <span>买 {buy}</span>
                      <span>卖 {sell}</span>
                    </div>
                    <div className="button-row compact">
                      <button type="button" disabled={!canAct} onClick={() => buyGood(good.id, 1)}>买 1</button>
                      <button type="button" disabled={!canAct} onClick={() => buyGood(good.id, 5)}>买 5</button>
                      <button type="button" disabled={!canAct || owned < 1} onClick={() => sellGood(good.id, 1)}>卖 1</button>
                      <button type="button" disabled={!canAct || owned < 5} onClick={() => sellGood(good.id, 5)}>卖 5</button>
                    </div>
                  </article>
                )
              })}
            </div>
            </section>
          </div>

          <aside className="side-stack">
          <section className="panel role-panel">
            <PanelTitle kicker="角色" title="背包与装备" />
            <div className="background-card">
              <strong>{game.background?.name ?? '无名行商'}</strong>
              <span>{game.background?.text}</span>
              <small>{game.background ? describeBackground(game.background) : '无数值修正'}</small>
            </div>
            <div className="inventory-list">
              {Object.entries(game.inventory).filter(([, qty]) => qty > 0).length ? (
                Object.entries(game.inventory)
                  .filter(([, qty]) => qty > 0)
                  .map(([id, qty]) => <span key={id} className={`rarity-chip rarity-${goodsById[id].rarity}`}>{goodsById[id].name} × {qty}</span>)
              ) : (
                <span>货舱空空，正适合抄底。</span>
              )}
            </div>
            <div className="equipment-slots">
              <Slot label="武器" item={getEquippedItem(game, 'weapon')} />
              <Slot label="防具" item={getEquippedItem(game, 'armor')} />
              <Slot label="饰品" item={getEquippedItem(game, 'trinket')} />
            </div>
            <p className="assist-note">{describeAssist(game)}</p>
            <div className="guild-card">
              <strong>商会等级 {game.guild?.level ?? 1}</strong>
              <span>经验 {game.guild?.xp ?? 0} · 主路线 {routeLabels[getGuildRoute(game)]}</span>
              <small>跑商 {game.guild?.routes?.trade ?? 0} / 探险 {game.guild?.routes?.explore ?? 0} / 战斗 {game.guild?.routes?.combat ?? 0} / 社交 {game.guild?.routes?.social ?? 0}</small>
              <small>路线被动：跑商压价、探险省补给、战斗减伤、社交增好感会随主路线等级生效。</small>
              <small>本地熟练度 {getMasteryLevel(game, game.location)} 级，风险压力 {game.riskPressure ?? 0}/24。</small>
            </div>
            <button type="button" disabled={!canAct || (game.riskPressure ?? 0) <= 0} onClick={restAtLocation}>休整车队</button>
          </section>

          <section className="panel rumor-panel">
            <PanelTitle kicker="情报" title="明日风向" />
            <div className="rumor-list">
              <span>{describeRouteCondition(game.routeCondition)}</span>
              <span>{describeLocalScene(game.localScene)}</span>
              {(game.rumors ?? []).map((rumor) => <span key={rumor.id}>{describeRumor(rumor)}</span>)}
              {(game.worldNews ?? []).map((news) => <span key={news.id}>{describeWorldNews(news)}</span>)}
            </div>
          </section>

          <section className="panel discovery-panel">
            <PanelTitle kicker="秘闻" title={`${currentLocation.name}地图册`} />
            <div className="discovery-list">
              <span className="discovery-progress">已发现 {currentDiscoveries.length}/{currentDiscoveryTotal} 处，本地探索和偶发旅途会继续补全地图。</span>
              {currentDiscoveries.length ? (
                currentDiscoveries.map((landmark) => (
                  <article key={landmark.id} className="discovery-card">
                    <strong>{landmark.name}</strong>
                    <small>{landmark.text}</small>
                  </article>
                ))
              ) : (
                <p className="empty-note">这里还没有记录秘闻。多探索本地、沿途留意线索，会逐步揭开地点故事。</p>
              )}
            </div>
          </section>

          <section className="panel faction-panel">
            <PanelTitle kicker="势力" title="商会关系" />
            <div className="faction-list">
              {FACTIONS.map((faction) => (
                <span key={faction.id} className={faction.locationId === game.location ? 'active' : ''}>
                  <strong>{faction.name}</strong>
                  <small>好感 {game.factions?.[faction.id] ?? 0} · {faction.text}</small>
                  <small>{describeFactionFavor(game, faction.locationId)}</small>
                </span>
              ))}
            </div>
          </section>

          <section className="panel commission-panel">
            <PanelTitle kicker="委托" title="本地委托板" />
            <div className="route-contract-list">
              {game.activeRouteContract ? (
                <article className="commission-card route-contract-card active">
                  <strong>在途商单 · {describeRouteContract(game.activeRouteContract)}</strong>
                  <span>{getRouteContractStatus(game)}</span>
                  <small>交付奖励 {Math.round(game.activeRouteContract.rewardGold * (game.day > game.activeRouteContract.deadline ? 0.45 : 1))} 金币 · 准时抵达可获目的地势力好感</small>
                  <div className="button-row compact">
                    <button type="button" disabled={!canAct} onClick={completeRouteContract}>交付商单</button>
                    <button type="button" disabled={!canAct} onClick={abandonRouteContract}>放弃商单</button>
                  </div>
                </article>
              ) : (
                <article className="commission-card route-contract-card">
                  <strong>跨城商单 · {describeRouteContract(game.routeContract)}</strong>
                  <span>接单后需自行备货并送达目的地。</span>
                  <small>奖励 {game.routeContract?.rewardGold ?? 0} 金币 · 准时完成可获目的地势力好感 +1</small>
                  <button type="button" disabled={!canAct || !game.routeContract} onClick={acceptRouteContract}>接下商单</button>
                </article>
              )}
            </div>
            <div className="commission-list">
              {(game.commissions ?? []).map((commission) => (
                <article key={commission.id} className="commission-card">
                  <strong>{commissionLabels[commission.type]} · {commission.text}</strong>
                  <span>{getCommissionStatus(game, commission)}</span>
                  <small>奖励 {commission.rewardGold} 金币 · 势力好感 +1</small>
                  <button
                    type="button"
                    disabled={!canAct || (commission.type !== 'bounty' && getCommissionStatus(game, commission) !== '可完成')}
                    onClick={() => completeCommission(commission.id)}
                  >
                    {commission.type === 'bounty' ? '接下悬赏' : '完成委托'}
                  </button>
                </article>
              ))}
            </div>
          </section>

          <section className="panel social-panel">
            <PanelTitle kicker="社交" title="人物关系" />
            {knownNpcs.length ? (
              <>
                <div className="npc-tabs">
                  {knownNpcs.map((npc) => {
                    const rel = game.relationships[npc.id]
                    return (
                      <button
                        key={npc.id}
                        type="button"
                        className={activeNpc?.id === npc.id ? 'active' : ''}
                        onClick={() => setSelectedNpcId(npc.id)}
                      >
                        {npcArt[npc.id] && <img src={npcArt[npc.id]} alt="" loading="lazy" />}
                        <span>{npc.name} · {relationStage(rel)}</span>
                      </button>
                    )
                  })}
                </div>
                {activeNpc && activeRel && (
                  <div className="npc-detail">
                    <div className="npc-profile">
                      {npcArt[activeNpc.id] && <img src={npcArt[activeNpc.id]} alt="" />}
                      <span>
                        <strong>{activeNpc.name}</strong>
                        <small>{activeNpc.role} · 好感 {activeRel.affection}/100 · {relationStage(activeRel)}</small>
                      </span>
                    </div>
                    <small>{activeNpc.text}</small>
                    <small>偏好礼物：{activeNpc.likes.map((id) => goodsById[id].name).join('、')}</small>
                    <small>伴侣加成：{formatNpcBonus(activeNpc.bonus)}</small>
                    <small>关系提示：{relationshipHint(activeNpc, activeRel)}</small>
                    <small className={activeNpcInteractedToday ? 'daily-limit is-used' : 'daily-limit'}>
                      {activeNpcInteractedToday ? '今日已互动：明天才能继续推进这段关系。' : '今日可互动：每位人物每天只能成功互动一次。'}
                    </small>
                    <div className="button-row compact social-actions">
                      <button type="button" disabled={!canAct || activeNpcInteractedToday} onClick={() => socialAction(activeNpc.id, 'talk')}>交谈</button>
                      <button type="button" disabled={!canAct || activeNpcInteractedToday} onClick={() => socialAction(activeNpc.id, 'date')}>相处</button>
                      <button type="button" disabled={!canAct || activeNpcInteractedToday} onClick={() => socialAction(activeNpc.id, 'gift')}>送礼</button>
                      <button type="button" disabled={!canAct || activeNpcInteractedToday} onClick={() => socialAction(activeNpc.id, 'cooperate')}>合作</button>
                      <button type="button" disabled={!canAct || activeNpcInteractedToday || activeRel.affection < 25} onClick={() => socialAction(activeNpc.id, 'assist')}>邀同行</button>
                      <button type="button" disabled={!canAct || activeNpcInteractedToday || activeRel.affection < 35} onClick={() => socialAction(activeNpc.id, 'quest')}>共同任务</button>
                      <button type="button" disabled={!canAct || activeNpcInteractedToday || activeRel.confessed || activeRel.affection < 45} onClick={() => socialAction(activeNpc.id, 'confess')}>表白</button>
                      <button type="button" disabled={!canAct || activeNpcInteractedToday || activeRel.married || !activeRel.confessed || activeRel.affection < 75} onClick={() => socialAction(activeNpc.id, 'marry')}>结婚</button>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <p className="empty-note">还没有结识人物。旅行、完成事件或拜访各地时，新的关系会慢慢出现在这里。</p>
            )}
          </section>

          </aside>
        </div>

      <section className="panel equipment-shop-row">
        <PanelTitle kicker="工坊" title="装备商店与装备栏" />
        <div className="equipment-workshop-grid">
          <section>
            <h3>工坊购买</h3>
            <div className="equipment-list">
              {EQUIPMENT.filter((item) => item.source === 'shop').map((item) => {
                return (
                  <article key={item.id} className={`equipment-row rarity-border rarity-${item.rarity}`}>
                    <div>
                      <strong className={`rarity-text rarity-${item.rarity}`}>{item.name}</strong>
                      <span>{slotName(item.slot)} · {describeRarity(item.rarity)} · {item.price} 金币</span>
                      <small>攻 +{item.attack} 防 +{item.defense} 生命 +{item.maxHp} 货舱 +{item.capacity} 声望 +{item.reputation}</small>
                      <small>{item.text}</small>
                    </div>
                    <div className="button-row compact">
                      <button type="button" disabled={!canAct} onClick={() => buyEquipment(item.id)}>购买</button>
                    </div>
                  </article>
                )
              })}
            </div>
          </section>
          <section>
            <h3>装备栏</h3>
            <p className="equipment-market-note">{describeEquipmentMarket(game)}</p>
            <div className="owned-equipment-list">
              {(game.equipmentOwned ?? []).length ? (
                game.equipmentOwned.map((instance) => {
                  const item = getEquipmentItem(instance)
                  if (!item) return null
                  const equipped = Object.values(game.equipped).includes(instance.uid)
                  const sellPrice = getEquipmentSellPrice(game, item)
                  return (
                    <article key={instance.uid} className={`owned-equipment rarity-border rarity-${item.rarity}`}>
                      <strong className={`rarity-text rarity-${item.rarity}`}>{item.name}</strong>
                      <span>{slotName(item.slot)} · {describeRarity(item.rarity)} · {item.source === 'loot' ? '掉落' : '工坊'}</span>
                      <span>当前地点出售价：{sellPrice} 金币</span>
                      <small>攻 +{item.attack} 防 +{item.defense} 生命 +{item.maxHp} 货舱 +{item.capacity} 声望 +{item.reputation}</small>
                      <div className="button-row compact">
                        <button type="button" disabled={!canAct || equipped} onClick={() => equipItem(instance.uid)}>装备</button>
                        <button type="button" disabled={!canAct || equipped} onClick={() => sellEquipment(instance.uid)}>出售 {sellPrice}</button>
                      </div>
                    </article>
                  )
                })
              ) : (
                <p className="empty-note">还没有获得装备。工坊购买、战斗胜利和探索都有机会补充装备库。</p>
              )}
            </div>
          </section>
        </div>
      </section>
      </div>

      <div className={`lower-grid ${activeTab === 'records' ? 'is-active' : ''}`}>
        <section className="panel save-panel">
          <PanelTitle kicker="存档" title="导入与导出" />
          <div className="save-actions">
            <button type="button" onClick={exportSave}>导出存档</button>
            <button type="button" onClick={importSave}>导入存档</button>
            <button type="button" onClick={resetGame}>新开一局</button>
          </div>
          <textarea
            value={saveText}
            onChange={(event) => setSaveText(event.target.value)}
            placeholder="点击导出存档会生成文本；粘贴存档文本后点击导入存档。"
            rows={7}
          />
          {saveError && <p className="save-error">{saveError}</p>}
        </section>

        <section className="panel achievement-panel">
          <PanelTitle kicker="目标" title="成就" />
          <div className="achievement-grid">
            {['经营', '旅途', '冒险', '势力', '人物'].map((category) => (
              <section key={category} className="achievement-section">
                <h3>{category}</h3>
                <div>
                  {ACHIEVEMENTS.filter((achievement) => achievementCategory(achievement) === category).map((achievement) => {
                    const unlocked = game.achievements.includes(achievement.id)
                    return (
                      <article key={achievement.id} className={`achievement ${unlocked ? 'unlocked' : ''}`}>
                        <strong>{achievement.name}</strong>
                        <span>{achievement.text}</span>
                      </article>
                    )
                  })}
                </div>
              </section>
            ))}
          </div>
        </section>
      </div>
    </main>
  )
}

function Stat({ label, value }) {
  return (
    <div className="stat">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  )
}

function PanelTitle({ kicker, title }) {
  return (
    <div className="panel-title">
      <span>{kicker}</span>
      <h2>{title}</h2>
    </div>
  )
}

function Slot({ label, item }) {
  return (
    <div className={`slot ${item ? `rarity-border rarity-${item.rarity}` : ''}`}>
      <span>{label}</span>
      <strong className={item ? `rarity-text rarity-${item.rarity}` : ''}>{item ? item.name : '未装备'}</strong>
    </div>
  )
}

function slotName(slot) {
  return { weapon: '武器', armor: '防具', trinket: '饰品' }[slot] ?? slot
}

function formatNpcBonus(bonus) {
  const labels = { attack: '攻击', defense: '防御', maxHp: '生命', capacity: '货舱', reputation: '声望' }
  const parts = Object.entries(bonus)
    .filter(([, value]) => value)
    .map(([key, value]) => `${labels[key] ?? key} +${value}`)
  return parts.length ? parts.join(' / ') : '无'
}

export default App
