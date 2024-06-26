<template>
  <context-holder />
  <main v-if="selectedChat" class="w-3/4 flex flex-col relative">
    <header class="bg-white p-4 shadow-lg flex items-center">
      <div v-if="selectedChat.avatar" class="w-10 h-10 rounded-full mr-3">
        <img :src="selectedChat.avatar" alt="avatar" class="w-full h-full rounded-full" />
      </div>
      <div v-else class="w-10 h-10 rounded-full mr-3">
        <a-avatar class="w-full h-full">
          <template #icon><UserOutlined /></template>
        </a-avatar>
      </div>
      <h2 class="font-semibold text-lg">{{ selectedChat.name }}</h2>
    </header>
    <div class="flex-1 p-4 overflow-auto bg-gray-100 relative">
      <div
        v-show="selectedChat.game"
        class="absolute inset-0 flex flex-col items-center justify-center"
      >
        <div class="w-full max-w-2xl bg-white p-4 shadow-2xl rounded-lg mb-4 relative">
          <div class="absolute top-4 left-4">
            <a-button type="text" @click="handleLeave" icon>
              <CloseCircleOutlined style="font-size: 24px; color: red" />
            </a-button>
          </div>
          <div class="text-center font-semibold text-lg mb-4">
            現在是 {{ selectedChat.megame ? '我' : selectedChat.name }} 的回合
          </div>
          <div class="text-center font-semibold text-lg mb-4">當前連線數: {{ linenums }}</div>
        </div>
        <div class="w-full max-w-2xl bg-white p-4 shadow-2xl rounded-lg">
          <div class="relative pb-full aspect-ratio-box">
            <div class="absolute inset-0 grid grid-cols-5 gap-4">
              <div
                v-for="number in bingoNumbers"
                :key="number"
                :class="{
                  'bg-blue-500 text-white': selectedNumbers.includes(number),
                  'bg-blue-200 text-gray-700': !selectedNumbers.includes(number)
                }"
                class="w-full h-full flex items-center justify-center rounded-lg text-xl font-semibold cursor-pointer"
                @click="selectNumber(number)"
              >
                {{ number }}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div v-for="message in selectedChat.messages" :key="message.id" class="mb-4">
        <div v-if="message.isAnnouncement" class="w-full text-center text-gray-500">
          {{ message.text }}
        </div>
        <div v-else-if="message.isGame" class="flex">
          <div :class="{ 'text-right': message.sender === 'me', 'flex-1': true }" class="p-4">
            <div v-if="message.sender !== 'me'" class="text-gray-400 text-xs mb-1">
              {{ message.sender }}
            </div>
            <div
              :class="[
                'inline-block p-6 rounded-lg border',
                message.sender === 'me' ? 'bg-blue-50 border-blue-200' : 'bg-white shadow'
              ]"
              class="max-w-5xl"
            >
              <div class="text-gray-700 mb-4">
                <p>您有一個新的遊戲對戰邀請！</p>
                <p v-if="message.sender === 'me'">邀請已發送。</p>
                <p v-else>來自 {{ message.sender }}.</p>
              </div>
              <button
                v-if="message.sender === 'me'"
                @click="cancelGame(message)"
                class="w-full bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
              >
                取消邀請
              </button>
              <button
                v-else
                @click="acceptGame(message)"
                class="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              >
                接受遊戲對戰
              </button>
            </div>
            <div
              :class="{
                'text-right': message.sender === 'me',
                'text-left': message.sender !== 'me'
              }"
              class="text-gray-500 text-xs mt-1"
            >
              {{ new Date(message.timestamp).toLocaleTimeString() }}
            </div>
          </div>
        </div>

        <div v-else class="flex">
          <div v-if="message.sender !== 'me'" class="w-10 h-10 rounded-full mr-3">
            <div v-if="message.avatar">
              <img :src="message.avatar" alt="avatar" class="w-full h-full rounded-full" />
            </div>
            <div
              v-else
              class="w-full h-full rounded-full bg-gray-300 flex items-center justify-center text-white text-xl"
            >
              <a-avatar class="w-full h-full">
                <template #icon><UserOutlined /></template>
              </a-avatar>
            </div>
          </div>
          <div :class="{ 'text-right': message.sender === 'me', 'flex-1': true }">
            <div v-if="message.sender !== 'me'" class="text-gray-400 text-xs mb-1">
              {{ message.sender }}
            </div>
            <div
              :class="[
                'inline-block px-4 py-2 rounded-lg',
                message.sender === 'me' ? 'bg-blue-500 text-white' : 'bg-white shadow'
              ]"
            >
              <p v-if="message.text" class="whitespace-pre-wrap break-words">{{ message.text }}</p>
              <img
                v-if="message.image"
                :src="message.image"
                class="mt-2 rounded-lg max-w-xs bg-transparent"
              />
            </div>
            <div
              :class="{
                'text-right': message.sender === 'me',
                'text-left': message.sender !== 'me'
              }"
              class="text-gray-500 text-xs mt-1"
            >
              {{ new Date(message.timestamp).toLocaleTimeString() }}
            </div>
          </div>
        </div>
      </div>
    </div>
    <MessageInput
      @sendMessage="handleSendMessage"
      @sendBingoInvitation="handleBingoInvitation"
      :chatroomid="selectedChat.id"
    />
  </main>
</template>

<script setup>
import { defineProps, defineEmits, ref, watch } from 'vue'
import MessageInput from '@/components/main/MessageInput.vue'
import { UserOutlined } from '@ant-design/icons-vue'
import { message } from 'ant-design-vue'
import createWebSocket from '@/functions/websocket'

const [messageApi, contextHolder] = message.useMessage()

const linenums = ref(0)
const bingoNumbers = ref(shuffle(Array.from({ length: 25 }, (_, i) => i + 1)))
const selectedNumbers = ref([])
const props = defineProps({
  selectedChat: Object,
  meState: Object,
  selectnum: Number,
  from: Number
})
const ws = createWebSocket(`wss://${import.meta.env.VITE_BACKEND}`)
import { CloseCircleOutlined } from '@ant-design/icons-vue'

const handleLeave = () => {
  ws.send(
    JSON.stringify({
      type: 'game_end',
      to: props.selectedChat.id,
      from: props.meState.id,
      win: null
    })
  )
}

watch(
  () => props.selectnum,
  (num) => {
    if (num == -1) {
      bingoNumbers.value = shuffle(Array.from({ length: 25 }, (_, i) => i + 1))
      selectedNumbers.value = []
      linenums.value = 0
      return
    }
    if (num != null) {
      chagenumber(num)
      linenums.value = countLines()
      console.log(linenums.value)
      if (linenums.value >= 5) {
        messageApi.success(`bingo!`)
        ws.send(
          JSON.stringify({
            type: 'game_end',
            to: props.selectedChat.id,
            from: props.meState.id,
            win: props.meState.id
          })
        )
        return
      } else {
        messageApi.info(`選擇了 ${num} 號`)
      }
      if (props.from == props.meState.id) {
        emit('change_who_game', false)
      } else {
        emit('change_who_game', true)
      }
    }
  }
)

const countLines = () => {
  let lines = []
  let ans = 0
  // 檢查行
  for (let i = 0; i < 5; i++) {
    const row = bingoNumbers.value.slice(i * 5, i * 5 + 5)
    // console.log(row)
    if (row.every((number) => selectedNumbers.value.includes(number))) {
      lines.push(row)
    }
  }

  // 檢查列
  for (let i = 0; i < 5; i++) {
    let col = []
    for (let j = 0; j < 5; j++) {
      col.push(bingoNumbers.value[i + j * 5])
    }
    if (col.every((number) => selectedNumbers.value.includes(number))) {
      lines.push(col)
    }
  }

  // 檢查主對角線
  let mainDiagonal = []
  for (let i = 0; i < 5; i++) {
    mainDiagonal.push(bingoNumbers.value[i * 6])
  }
  if (mainDiagonal.every((number) => selectedNumbers.value.includes(number))) {
    lines.push(mainDiagonal)
  }

  // 檢查副對角線
  let antiDiagonal = []
  for (let i = 0; i < 5; i++) {
    antiDiagonal.push(bingoNumbers.value[i * 4 + 4])
  }
  if (antiDiagonal.every((number) => selectedNumbers.value.includes(number))) {
    lines.push(antiDiagonal)
  }
  for (let i = 0; i < lines.length; i++) {
    ans += 1
    if (lines[i].every((number) => number % 2 == 0)) {
      ans += 1
    } else if (lines[i].every((number) => number % 2 == 1)) {
      ans += 1
    }
  }
  return ans
}

const chagenumber = (number) => {
  if (!selectedNumbers.value.includes(number)) {
    selectedNumbers.value.push(number)
  }
}

const selectNumber = (number) => {
  if (props.selectedChat.megame == false) {
    messageApi.info(`現在是 ${props.selectedChat.name} 的回合`)
    return
  }
  if (selectedNumbers.value.includes(number)) {
    messageApi.info(`已選擇過 ${number} 號`)
    return
  }
  ws.send(
    JSON.stringify({
      type: 'select_number',
      to: props.selectedChat.id,
      from: props.meState.id,
      number: number
    })
  )
}

function shuffle(array) {
  let currentIndex = array.length,
    randomIndex

  while (currentIndex != 0) {
    randomIndex = Math.floor(Math.random() * currentIndex)
    currentIndex--
    ;[array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]]
  }

  return array
}

const emit = defineEmits([
  'sendMessage',
  'sendBingoInvitation',
  'cancelGame',
  'acceptGame',
  'change_who_game'
])

const cancelGame = (data) => {
  console.log(data)
  emit('cancelGame', data)
}

const acceptGame = (data) => {
  console.log(data)
  emit('acceptGame', data)
}

const handleBingoInvitation = () => {
  emit('sendBingoInvitation')
}

const handleSendMessage = (message) => {
  emit('sendMessage', message)
}
</script>

<style scoped>
textarea:focus {
  outline: none;
  box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
}

button:focus {
  outline: none;
  box-shadow: 0 0 0 0.2rem rgba(38, 143, 255, 0.5);
}

.whitespace-pre-wrap {
  white-space: pre-wrap;
}

.break-words {
  word-wrap: break-word;
  word-break: break-word;
}

.pb-full {
  padding-bottom: 100%;
}

.aspect-ratio-box {
  position: relative;
  width: 100%;
  height: 0;
  overflow: hidden;
}
</style>
