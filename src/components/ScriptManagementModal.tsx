import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, MessageSquarePlus, RotateCcw, Check, Sparkles, Hand, FileText, Clock, ThumbsDown, ThumbsUp, DollarSign, Wand2 } from 'lucide-react';
import { ScriptCategory, ScriptTemplates } from '../types';
import { CONTENT } from '../content';

const STORAGE_KEY = 'rader_scripts';

const CATEGORY_ORDER: ScriptCategory[] = [
  'greeting', 'project_intro', 'no_reply_followup', 'declined', 'accepted', 'price_rejected'
];

const CATEGORY_ICONS: Record<ScriptCategory, any> = {
  greeting: Hand,
  project_intro: FileText,
  no_reply_followup: Clock,
  declined: ThumbsDown,
  accepted: ThumbsUp,
  price_rejected: DollarSign,
};

const CATEGORY_COLORS: Record<ScriptCategory, { text: string; bg: string; border: string }> = {
  greeting:           { text: 'text-blue-400',   bg: 'bg-blue-400/10',   border: 'border-blue-400/30' },
  project_intro:      { text: 'text-purple-400', bg: 'bg-purple-400/10', border: 'border-purple-400/30' },
  no_reply_followup:  { text: 'text-orange-400', bg: 'bg-orange-400/10', border: 'border-orange-400/30' },
  declined:           { text: 'text-red-400',    bg: 'bg-red-400/10',    border: 'border-red-400/30' },
  accepted:           { text: 'text-green-400',  bg: 'bg-green-400/10',  border: 'border-green-400/30' },
  price_rejected:     { text: 'text-yellow-400', bg: 'bg-yellow-400/10', border: 'border-yellow-400/30' },
};

export function loadScripts(): ScriptTemplates | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
}

export function saveScripts(scripts: ScriptTemplates) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(scripts));
}

export function getDefaultScripts(projectName?: string): ScriptTemplates {
  const defaults = CONTENT.contact.scriptDefaults as Record<string, string>;
  const result: any = {};
  for (const key of CATEGORY_ORDER) {
    let text = defaults[key] || '';
    if (projectName) {
      text = text.replace(/\{projectName\}/g, projectName);
    } else {
      text = text.replace(/\{projectName\}/g, '品牌合作');
    }
    result[key] = text;
  }
  return result as ScriptTemplates;
}

// --- AI 预生成话术库（每场景 20 条，点击随机切换） ---
const AI_SCRIPT_POOL: Record<ScriptCategory, string[]> = {
  greeting: [
    '嗨～关注你好久了！你的内容真的好有质感，每次看都觉得特别用心，很想认识你呀～',
    '你好呀！刷到你的笔记就停不下来，内容太干货了！冒昧打个招呼，希望有机会交流～',
    'Hi！一直在追你的更新，你的分享风格我超喜欢的，想跟你聊聊可以吗？',
    '姐妹你好～偶然刷到你的主页就被圈粉了，内容做得好用心！能认识一下吗？',
    '你好！看了你好多篇笔记，觉得你对这个领域真的很有研究，想跟你交流学习一下～',
    '嗨嗨～你的笔记风格好独特！内容也很接地气，想跟你认识一下可以吗？',
    '你好呀～最近一直在看你的内容，觉得你分享的东西都好实用，忍不住来打个招呼！',
    '嗨！不知道你还记不记得我之前给你点过赞，你的内容我真的每篇都有看～想认识你！',
    'Hello～我是你的老粉了！你最近更新的那几篇质量也太高了吧，想跟你交个朋友可以吗？',
    '你好～翻了你好多篇笔记，发现你不光内容好，回复粉丝也好认真！想跟你聊几句～',
    '嗨～看你主页就觉得好亲切！你的风格我真的很喜欢，希望以后能多多交流呀～',
    '你好！朋友推荐我看你的笔记，一看就停不下来了，你的表达能力真的好强～能认识一下吗？',
    '嗨嗨嗨～你的笔记封面做得也太好看了！点进来内容更棒，想请教你一些问题可以吗？',
    '你好呀，同领域的博主来打招呼啦！你的内容角度好独特，想跟你交流一下经验～',
    '嗨～第一次给你发消息好紧张hh 你的内容真的帮到我很多，想当面感谢你！',
    '你好！我是做品牌运营的，平时经常看你的笔记学习，你对用户需求的把握真的很准～',
    '嗨～你应该不认识我但我认识你哈哈！追了你半年多了，你的每个系列我都有跟～',
    '你好呀！看了你分享的经历觉得好真实，现在这样愿意分享真实体验的博主真的不多了～',
    '嗨～冒昧打扰了！你上次发的那篇笔记在我朋友圈都传开了，大家都说写得太好了！',
    '你好！关注你有一段时间了，你的内容一直很稳定，感觉你是那种很认真做内容的人～想认识！',
  ],
  project_intro: [
    '我们是一个专注护肤领域的品牌，最近有一款新品想找合适的博主做真实分享。合作形式灵活，图文/视频都可以，费用面议～你的内容风格跟我们的产品调性特别契合！',
    '我们正在做一个护肤品牌的种草推广项目，产品口碑很好，想找有真实使用体验的博主合作。合作方式不限，可以根据你的风格来定制，报酬也会很有诚意的～',
    '我们品牌有一款明星产品想做达人推广，看了你的内容觉得特别合适！合作形式可以是产品体验+笔记分享，费用根据内容形式500-5000元不等，具体可以聊～',
    '最近我们有个护肤新品上线，想邀请优质博主做首批体验官。产品免费寄送+稿费，合作周期灵活，更看重真实的使用反馈和你的个人风格～',
    '我们是XX品牌的合作团队，目前在招募合作达人。合作内容是产品体验+原创笔记，报酬优厚，也支持长期合作。你的内容质量和粉丝互动都很不错，很想跟你合作！',
    '简单介绍下～我们品牌专做敏感肌护肤，这次想找真实体验过皮肤问题的博主来分享使用感受。不需要硬广，你按自己的风格来就好，稿费另算～',
    '我们有一款主打成分党的精华液，上市前想做一轮KOC真实测评。合作很简单：寄产品给你体验2周，然后出一篇真实感受的笔记，稿费1000-3000看内容形式～',
    '我们团队在做一个护肤品牌的年度推广计划，想建立一批长期合作的达人关系。第一次合作以产品体验为主，后续有稳定的月度合作机会和专属优惠码分佣～',
    '直接说合作吧！我们品牌下个月有新品发布，想找5位博主做首发体验。产品+稿费+独家折扣码，还会在官方账号做二次传播，给你带额外曝光～',
    '我们是一个新锐国货护肤品牌，产品在药监局有备案，成分很扎实。想找你这样有专业度的博主做深度测评，预算充足，形式你来定～',
    '我们这边有个祛痘精华的推广需求，看了好多博主觉得你的内容最真实。合作不限形式，可以是vlog、图文测评或者日常分享，我们更看重你的真实表达～',
    '品牌方委托我们找合作达人，这次项目是护肤品的618种草专题。单篇稿费2000起，额外有销售分佣，你的粉丝画像跟我们的目标用户很匹配！',
    '我们做了一款氨基酸洁面，想找有敏感肌经历的博主来做真实分享。合作模式是产品+稿费，如果你觉得产品好用还可以谈长期合作和专属优惠码～',
    '项目信息同步一下：我们品牌下季度有3个新品要推，想提前锁定一批优质合作达人。首次合作先做一款试试，后续稳定排期，每月至少1次合作机会～',
    '我们是一个专做功效护肤的品牌，产品有临床数据支撑。这次想找博主做28天使用记录系列，全程记录皮肤变化，稿费按系列整体结算会比较高～',
    '我们有一款修复面霜想做秋冬季节种草，预算在每篇1500-5000之间。你的内容风格很适合我们的产品定位，如果感兴趣我发详细brief给你看看？',
    '品牌合作邀请～我们是做医美级护肤品的，这次想做一个"成分解读+使用体验"的系列内容。你之前发过类似的科普笔记，风格很match！',
    '我们团队看了很多博主，觉得你的内容真实度和粉丝信任感都很强。这次合作预算比较充足，想做一个深度的产品体验+对比测评，你有兴趣吗？',
    '简单聊下合作～我们品牌有一款刚拿到专利的祛痘产品，想找真实战痘经历的博主做体验分享。不用夸大效果，真实记录就好，稿费和产品都会安排～',
    '我们在做一个"素人改造计划"的品牌活动，想邀请你作为合作博主参与。全套产品提供+专业护肤顾问指导+内容创作稿费，整体权益很丰富～',
  ],
  no_reply_followup: [
    '嗨～上次给你发的消息不知道有没有看到？我们的合作机会还在，如果你感兴趣的话随时回复我呀～',
    '不好意思再打扰一下～之前跟你聊的合作想确认一下你的意向，方便的话回复我一下哈～',
    '姐妹～之前的消息可能被你漏掉了，我们这边的合作名额快满了，想优先跟你确认一下～',
    '再冒昧提醒一下～之前跟你说的那个项目还有名额，觉得你真的很适合！有空回复我一下吧～',
    '嗨～怕你没看到之前的消息所以再说一次，我们的品牌合作机会不多了，很希望能跟你合作呀～',
    '不好意思又来了hh 主要是觉得你真的很合适这个项目，不想错过～方便的话回复我一下？',
    '最后再跟进一次～我们这期的合作达人快确定了，还给你留着位置呢，要不要考虑一下？',
    '嗨～可能你最近比较忙没看到消息。我们的合作截止日期快到了，如果感兴趣的话尽快回复我哈～',
    '又来打扰啦～之前说的那个项目品牌方很认可你的内容，特意让我再联系你一次，你看看？',
    '嗨～不知道你有没有看到之前的消息？我们可以先简单聊聊，不一定要马上确定合作的～',
    '姐妹我又来了！你最近发的笔记我都有看，越看越觉得我们的产品适合你，再考虑考虑？',
    '温馨提醒一下～之前跟你说的合作机会本周就截止了，如果需要更多信息我可以补充给你～',
    '嗨～可能之前的消息太长了你没来得及看，简单来说就是有个品牌想跟你合作，有兴趣回我就行！',
    '不好意思打扰～就是想最后确认一下你对我们之前提到的合作有没有兴趣，没有的话也完全理解！',
    '嗨～我看你最近更新了好几篇，内容一如既往地好！顺便问一下之前的合作你考虑得怎么样了？',
    '又来冒泡了～我们这边又追加了一些预算，合作条件比之前更好了。你要不要重新看看？',
    '姐妹～我知道你可能很忙，简单回复我一个"感兴趣"或"暂时不考虑"就行，我好安排后面的工作～',
    '嗨嗨～不是催你哈，就是这个项目品牌方一直在问我进度，所以想确认一下你这边的想法～',
    '最后一次跟进啦！如果你暂时不方便合作完全没关系，我们后续有新项目还会第一时间想到你的～',
    '不好意思再问一下～之前发的合作邀请你有看到吗？如果不太方便直接说就好，不用有压力的～',
  ],
  declined: [
    '完全理解的！每个人都有自己的考虑。如果以后有合适的机会，还是很希望能跟你合作，先关注你啦～',
    '没关系的～感谢你的回复！我们后续还会有不同类型的项目，到时候再看看有没有更适合你的，保持联系哈～',
    '理解理解！其实我们还有其他形式的合作，比如纯产品置换、短视频等，如果这些感兴趣的话也可以聊聊～',
    '好的没关系！不过我们下个月还有个新项目，预算和形式都会不一样，到时候可以再考虑一下～先互相关注着吧！',
    '收到！完全尊重你的决定。你的内容我会继续关注的，说不定以后有更合适的机会能一起玩～',
    '没事没事～合作这种事情讲究一个缘分嘛。我先关注你，后面有合适的再看！',
    '好的理解！其实我个人也很喜欢你的内容，不管合不合作都会继续支持你的～',
    '没关系哈～可能是时机不太对。我们品牌每个季度都有新的合作计划，下次一定优先考虑你！',
    'OK的！谢谢你这么认真地回复我。如果以后你的档期空出来了或者有合作的想法，随时联系我～',
    '理解！每个博主对合作都有自己的标准，这很专业。我们后面有更大的项目时再来找你～',
    '好哒～虽然这次没能合作，但你的内容真的很棒！以后有合适的机会我还会来的，先互关吧～',
    '完全OK！不合作也没关系，你的笔记我还是会看的hh 有新项目的话再来骚扰你～',
    '收到啦～不强求的！我们后面还有针对不同内容形式的合作方案，到时候可以再看看有没有你感兴趣的～',
    '好的没问题！其实很理解你的顾虑，我们品牌也在不断升级合作模式，下次可能就更适合你了～',
    '谢谢你的回复！其实我们还有一些纯体验不需要发笔记的活动，如果这种你感兴趣的话也可以参加～',
    '理解的～那我先把你加到我们的达人库里，后面有新的合作机会会第一时间通知你，不会很频繁的放心！',
    'OK～非常感谢你花时间看我的消息和回复！以后有什么我能帮到你的也可以随时找我～',
    '好的收到！虽然有点遗憾但完全理解。你继续做好内容，有合适的品牌合作我帮你推荐～',
    '没关系的！你的想法很对，合作一定要双方都觉得合适才行。保持联系，以后再看机会～',
    '好哒好哒～那就先这样，以后我们有新的玩法和更好的合作条件时再来找你，期待下次合作！',
  ],
  accepted: [
    '太好啦！那我们就正式开始合作流程吧～我先把产品详情和brief发给你，你看看有什么想法我们再调整～',
    '超开心能跟你合作！我这边马上安排寄样，你收到后先自己体验一段时间，然后我们再确定出内容的时间线～',
    '耶！那我们就约起来！我先发合作协议给你确认一下细节，有什么问题随时沟通，争取做出最好的内容～',
    '太棒了！合作愉快～我这边准备好了一份详细的brief，包括产品卖点和创作参考，发给你看看，你自由发挥就好！',
    '开心！那我这边先跟品牌方确认最终细节，明天把正式的合作方案发给你，你看完觉得OK就可以开始了～',
    '太好了！我先发个合作流程给你看一下，大概就是寄样→体验→出内容→确认→发布→结算，很简单的～',
    '耶耶耶！那我马上安排～你方便给我一个收货地址吗？我这边最快明天就能把产品寄出去～',
    'Nice！那我们先加个微信方便沟通吧？后面寄样、对接、结算都在微信上比较方便～我的微信是…',
    '太开心了！跟你合作是我们团队期待已久的事情！我先把产品资料整理好发你，你有什么想法尽管说～',
    '确认合作！我先把所有需要的信息整理成一个文档发给你，包括产品介绍、卖点、合作要求和时间节点，你按自己的理解来创作就好～',
    '好的那就这么定了！关于内容方向你有什么初步的想法吗？我们这边不限制太多，更想看你的个人风格～',
    '合作愉快！我们对内容没有太多硬性要求，只有一点——希望是你真实使用后的感受，好的坏的都可以说～',
    '太棒了！你放心，我们这次合作不会有很多条条框框，主要就是希望你真实体验然后用你习惯的方式分享就好～',
    '开心开心！那我这边先走个内部流程，大概1-2个工作日就能把合同和产品一起寄给你，你注意查收～',
    '好的合作确认！后续有任何问题都可以找我，我基本上随时在线的。期待你的作品！',
    'Perfect！那我们先确定一下时间线——你看下周收到产品，体验一周后出内容，月底前发布这个节奏OK吗？',
    '太好了！你是我们这次合作里第一个确认的博主，我们会优先安排你的寄样和素材支持～',
    '合作达成！我这边已经跟品牌方同步了，他们也很期待跟你的合作。我先整理brief发给你～',
    '耶！那我们就正式开始吧。我先把产品的核心卖点和我们希望传达的信息点发你，你结合自己的风格来就行～',
    '太开心了！合作正式启动～接下来我会建一个小群方便我们三方沟通（你、我、品牌方），有什么问题随时群里说～',
  ],
  price_rejected: [
    '理解你的报价标准！其实我们这次合作除了稿费之外，还有额外的流量扶持和长期合作绑定，整体价值会更高。要不我详细说说？',
    '你的内容质量值这个价位！不过这次的预算确实有限，我们可以用"稿费+产品+独家折扣码分佣"的模式来补充，整体收益可能更好～',
    '完全理解～其实我们可以灵活调整合作形式，比如减少产出数量但保持单篇费用，或者做一个短期测评系列，这样双方都比较舒服？',
    '价格方面我们再沟通一下！这次项目还附带品牌年度合作优先权和线下活动名额，综合权益还是很有竞争力的，你觉得呢？',
    '收到！预算方面我跟品牌方再争取一下。另外我们可以尝试阶梯式合作——先做一篇体验，效果好的话后续加量加价，你觉得这个方案怎么样？',
    '理解的！不过你看这样行不行——我们把合作形式简化一下，比如只出一条短视频或者图文笔记，这样工作量小了价格也好谈一些？',
    '你的报价我记下了！虽然这次预算有差距，但我会反馈给品牌方。同时我们还有其他品牌的项目，预算可能更匹配，要不要看看？',
    '价格差距我理解～要不我们换个思路：这次先做产品置换+少量稿费打个样，后续按你的正常报价来排长期合作？',
    '完全理解你的价位！其实我们可以在合作形式上做调整——比如你正常发你的内容，我们只需要在其中自然带到产品就好，工作量会轻很多～',
    '你的报价很专业！我跟品牌方商量了一下，他们可以在原来的基础上追加一些权益：比如全年新品优先体验权+线下活动VIP邀请，你觉得呢？',
    '理解理解～要不这样：我们这次按你的半价先合作一篇试试水，如果数据好，下次直接按你的标准价走，而且优先给你排期？',
    '收到你的报价了！坦白说我们的预算确实有限，但可以额外提供品牌官方账号的转发和推荐位，帮你增加曝光，这个价值也不小的～',
    '你的定价我完全理解！我跟品牌方再争取一下。另外想问一下，如果是纯产品体验+好物分享的形式（不指定内容方向），你的价位会有不同吗？',
    '明白你的考虑！其实我们还可以提供一些非现金的权益，比如品牌的供应链资源、独家配方定制等，对你后续做内容也很有帮助～',
    '收到！价格方面我们确实有差距。不过你看这样行不行——我们做一个"系列合作"，总包价格会比单篇高很多，平摊下来每篇也接近你的标准？',
    '理解你的报价标准～我们能不能折中一下：稿费保持在我们的预算范围内，但额外给你一个高比例的销售分佣？如果产品真的好推，总收入可能超过你的报价～',
    '你的价位很合理！但我们这个项目预算确实是固定的。要不我帮你看看我们其他品牌客户的项目？有几个预算是你这个级别的～',
    '完全尊重你的价格体系！我们可以做一个分期合作方案——首期低预算试水，数据达标后二期三期逐步提价，最终达到你的标准报价？',
    '理解！价格这块我会继续跟品牌方沟通的。对了，我们还有一个达人互推计划，可以帮你对接其他品牌的合作资源，算是额外的增值服务～',
    '收到你的反馈！我们这样吧——这次合作我尽量帮你争取到最高预算，同时把你推荐进品牌的年度达人合作名单，后续合作的价格空间会大很多～',
  ],
};

function pickRandom<T>(arr: T[], exclude?: T): T {
  if (arr.length <= 1) return arr[0];
  const filtered = exclude ? arr.filter(v => v !== exclude) : arr;
  return filtered[Math.floor(Math.random() * filtered.length)];
}

const ScriptManagementModal = ({
  onClose,
  onConfirm,
  projectName,
}: {
  onClose: () => void;
  onConfirm: (scripts: ScriptTemplates) => void;
  projectName?: string;
}) => {
  const [activeCategory, setActiveCategory] = useState<ScriptCategory>('greeting');
  const [scripts, setScripts] = useState<ScriptTemplates>(() => {
    const saved = loadScripts();
    return saved || getDefaultScripts(projectName);
  });

  const handleChange = (category: ScriptCategory, value: string) => {
    setScripts(prev => ({ ...prev, [category]: value }));
  };

  const handleReset = () => {
    setScripts(getDefaultScripts(projectName));
  };

  const handleConfirm = () => {
    saveScripts(scripts);
    onConfirm(scripts);
  };

  /** AI 生成：从预生成池中随机选一条（排除当前内容） */
  const handleAiGenerate = (category: ScriptCategory) => {
    const pool = AI_SCRIPT_POOL[category];
    const current = scripts[category];
    const next = pickRandom(pool, current);
    setScripts(prev => ({ ...prev, [category]: next }));
  };

  /** 一键全部重新生成 */
  const handleAiGenerateAll = () => {
    const result: any = {};
    for (const cat of CATEGORY_ORDER) {
      result[cat] = pickRandom(AI_SCRIPT_POOL[cat], scripts[cat]);
    }
    setScripts(result as ScriptTemplates);
  };

  const categories = CONTENT.contact.scriptCategories as Record<string, string>;
  const descriptions = CONTENT.contact.scriptCategoryDescriptions as Record<string, string>;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="relative w-full max-w-4xl bg-tech-dark border border-tech-blue/30 rounded-3xl shadow-[0_0_50px_rgba(0,242,255,0.15)] flex flex-col max-h-[85vh]"
      >
        {/* Header */}
        <div className="p-6 border-b border-tech-blue/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-tech-blue/10 rounded-xl">
              <MessageSquarePlus size={24} className="text-tech-blue" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-tech-blue">{CONTENT.contact.scriptTitle}</h2>
              <p className="text-xs text-white/40 mt-0.5">{CONTENT.contact.scriptSubtitle}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-white/40 hover:text-white transition-colors">
            <X size={24} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 flex overflow-hidden">
          {/* Left: Category tabs */}
          <div className="w-56 border-r border-tech-blue/10 p-4 space-y-2 overflow-y-auto flex-shrink-0">
            {CATEGORY_ORDER.map(cat => {
              const Icon = CATEGORY_ICONS[cat];
              const colors = CATEGORY_COLORS[cat];
              const isActive = activeCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`w-full text-left p-3 rounded-xl border transition-all flex items-center gap-3 ${
                    isActive
                      ? `${colors.bg} ${colors.border} ${colors.text}`
                      : 'border-transparent hover:bg-white/5 text-white/50 hover:text-white/70'
                  }`}
                >
                  <Icon size={18} className={isActive ? colors.text : ''} />
                  <span className="text-sm font-medium">{categories[cat]}</span>
                </button>
              );
            })}
          </div>

          {/* Right: Editor */}
          <div className="flex-1 p-6 flex flex-col overflow-y-auto">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeCategory}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.15 }}
                className="flex-1 flex flex-col"
              >
                {/* Category header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    {(() => {
                      const Icon = CATEGORY_ICONS[activeCategory];
                      const colors = CATEGORY_COLORS[activeCategory];
                      return (
                        <>
                          <div className={`p-2 rounded-lg ${colors.bg} border ${colors.border}`}>
                            <Icon size={20} className={colors.text} />
                          </div>
                          <div>
                            <h3 className={`font-bold text-lg ${colors.text}`}>{categories[activeCategory]}</h3>
                            <p className="text-xs text-white/40">{descriptions[activeCategory]}</p>
                          </div>
                        </>
                      );
                    })()}
                  </div>
                  {/* Per-category AI generate button */}
                  <button
                    onClick={() => handleAiGenerate(activeCategory)}
                    className="px-3 py-1.5 border border-purple-500/30 text-purple-400 hover:bg-purple-500/10 rounded-lg flex items-center gap-1.5 text-xs font-medium transition-all hover:scale-105 active:scale-95"
                  >
                    <Wand2 size={13} />
                    换一条
                  </button>
                </div>

                {/* Textarea */}
                <div className="flex-1 relative">
                  <textarea
                    value={scripts[activeCategory]}
                    onChange={(e) => handleChange(activeCategory, e.target.value)}
                    className="w-full h-full min-h-[280px] bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white/90 text-sm leading-relaxed focus:border-tech-blue/40 outline-none transition-colors resize-none custom-scrollbar"
                    placeholder={`请输入${categories[activeCategory]}话术...`}
                  />
                  <div className="absolute bottom-3 right-3 text-xs text-white/20">
                    {scripts[activeCategory].length} 字
                  </div>
                </div>

                {/* Preview hint */}
                <div className="mt-3 flex items-center gap-2 text-white/20 text-xs">
                  <Sparkles size={12} />
                  <span>点击「换一条」可随机切换 AI 预生成话术，也可以直接编辑</span>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Footer */}
        <div className="p-5 border-t border-tech-blue/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={handleReset}
              className="px-4 py-2 border border-white/10 rounded-xl text-white/40 hover:text-white/70 hover:border-white/20 transition-all flex items-center gap-2 text-sm"
            >
              <RotateCcw size={14} />
              {CONTENT.contact.scriptReset}
            </button>
            <button
              onClick={handleAiGenerateAll}
              className="px-4 py-2 border border-purple-500/30 text-purple-400 hover:bg-purple-500/10 rounded-xl font-bold flex items-center gap-2 text-sm transition-all"
            >
              <Wand2 size={14} />
              全部重新生成
            </button>
          </div>
          <button
            onClick={handleConfirm}
            className="px-8 py-3 bg-tech-blue text-black rounded-xl font-bold hover:scale-105 transition-transform flex items-center gap-2"
          >
            <Check size={18} />
            {CONTENT.contact.scriptConfirm}
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default ScriptManagementModal;
