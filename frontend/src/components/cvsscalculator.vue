<template>
  <Card class="cvsscalculator">
    <!-- Main CVSS Score Header -->
    <div class="relative flex items-center p-6">
      <div class="flex-1">
        <span class="font-medium">
          {{ $t('cvss.title') }}
          <span class="ml-1 cursor-help" :title="$t('cvss.tooltip.baseMetricGroup_Legend')">ⓘ</span>
        </span>
      </div>

      <!-- Impact & Exploitability Scores -->
      <div v-if="cvss.baseImpact && cvss.baseExploitability" class="mr-32 flex gap-2">
        <Badge variant="secondary" class="bg-blue-900 text-white">
          {{ $t('cvss.impactSubscore') }}:&nbsp;<span class="font-bold">{{ roundUp1(cvss.baseImpact) }}</span>
        </Badge>
        <Badge variant="secondary" class="bg-blue-900 text-white">
          {{ $t('cvss.exploitabilitySubscore') }}:&nbsp;<span class="font-bold">{{ roundUp1(cvss.baseExploitability) }}</span>
        </Badge>
      </div>

      <!-- Main Score Display -->
      <div class="scoreRating" :class="cvss.baseSeverity">
        <span v-if="!cvss.baseMetricScore" class="baseSeverity">{{ $t('cvss.infoWhenNoScore') }}</span>
        <div v-else>
          <span class="baseMetricScore">{{ cvss.baseMetricScore }}</span>
          <span class="baseSeverity">({{ cvss.baseSeverity }})</span>
        </div>
      </div>
    </div>

    <Separator />

    <!-- Base Metrics Section -->
    <div class="p-6">
      <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
        <!-- Left Column - Base Metrics -->
        <div class="space-y-6">
          <!-- Attack Vector -->
          <div>
            <label class="mb-3 block font-medium">
              {{ $t('cvss.attackVector') }}
              <span class="ml-1 cursor-help" :title="$t('cvss.tooltip.AV_Heading')">ⓘ</span>
            </label>
            <ToggleGroup
              v-model="cvssObj.AV"
              :options="cvssItems.AV"
              :disabled="readonly"
              class="group-btn"
            />
          </div>

          <!-- Attack Complexity -->
          <div>
            <label class="mb-3 block font-medium">
              {{ $t('cvss.attackComplexity') }}
              <span class="ml-1 cursor-help" :title="$t('cvss.tooltip.AC_Heading')">ⓘ</span>
            </label>
            <ToggleGroup
              v-model="cvssObj.AC"
              :options="cvssItems.AC"
              :disabled="readonly"
              class="group-btn"
            />
          </div>

          <!-- Privileges Required -->
          <div>
            <label class="mb-3 block font-medium">
              {{ $t('cvss.privilegesRequired') }}
              <span class="ml-1 cursor-help" :title="$t('cvss.tooltip.PR_Heading')">ⓘ</span>
            </label>
            <ToggleGroup
              v-model="cvssObj.PR"
              :options="cvssItems.PR"
              :disabled="readonly"
              class="group-btn"
            />
          </div>

          <!-- User Interaction -->
          <div>
            <label class="mb-3 block font-medium">
              {{ $t('cvss.userInteraction') }}
              <span class="ml-1 cursor-help" :title="$t('cvss.tooltip.UI_Heading')">ⓘ</span>
            </label>
            <ToggleGroup
              v-model="cvssObj.UI"
              :options="cvssItems.UI"
              :disabled="readonly"
              class="group-btn"
            />
          </div>
        </div>

        <!-- Right Column - Impact Metrics -->
        <div class="space-y-6">
          <!-- Scope -->
          <div>
            <label class="mb-3 block font-medium">
              {{ $t('cvss.scope') }}
              <span class="ml-1 cursor-help" :title="$t('cvss.tooltip.S_Heading')">ⓘ</span>
            </label>
            <ToggleGroup
              v-model="cvssObj.S"
              :options="cvssItems.S"
              :disabled="readonly"
              class="group-btn"
            />
          </div>

          <!-- Confidentiality Impact -->
          <div>
            <label class="mb-3 block font-medium">
              {{ $t('cvss.confidentialityImpact') }}
              <span class="ml-1 cursor-help" :title="$t('cvss.tooltip.C_Heading')">ⓘ</span>
            </label>
            <ToggleGroup
              v-model="cvssObj.C"
              :options="cvssItems.C"
              :disabled="readonly"
              class="group-btn"
            />
          </div>

          <!-- Integrity Impact -->
          <div>
            <label class="mb-3 block font-medium">
              {{ $t('cvss.integrityImpact') }}
              <span class="ml-1 cursor-help" :title="$t('cvss.tooltip.I_Heading')">ⓘ</span>
            </label>
            <ToggleGroup
              v-model="cvssObj.I"
              :options="cvssItems.I"
              :disabled="readonly"
              class="group-btn"
            />
          </div>

          <!-- Availability Impact -->
          <div>
            <label class="mb-3 block font-medium">
              {{ $t('cvss.availabilityImpact') }}
              <span class="ml-1 cursor-help" :title="$t('cvss.tooltip.A_Heading')">ⓘ</span>
            </label>
            <ToggleGroup
              v-model="cvssObj.A"
              :options="cvssItems.A"
              :disabled="readonly"
              class="group-btn"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- Temporal & Environmental Metrics (Collapsible) -->
    <Collapsible
      :model-value="settings?.report?.public?.extendCvssTemporalEnvironment"
      class="bg-blue-gray-500 text-white"
    >
      <template #header>
        <span>{{ $t('cvss.temporalEnvironmentalTitle') }}</span>
      </template>

      <!-- Temporal Metrics -->
      <div class="p-6">
        <div class="relative mb-4 flex items-center">
          <div class="flex-1">
            <span class="font-medium">
              {{ $t('cvss.temporalTitle') }}
              <span class="ml-1 cursor-help" :title="$t('cvss.tooltip.temporalMetricGroup_Legend')">ⓘ</span>
            </span>
          </div>
          <div class="scoreRating" :class="cvss.temporalSeverity">
            <span v-if="!cvss.temporalMetricScore" class="baseSeverity">{{ $t('cvss.infoWhenNoScore') }}</span>
            <div v-else>
              <span class="baseMetricScore">{{ cvss.temporalMetricScore }}</span>
              <span class="baseSeverity">({{ cvss.temporalSeverity }})</span>
            </div>
          </div>
        </div>

        <Separator class="mb-6" />

        <div class="space-y-6">
          <!-- Exploit Code Maturity -->
          <div>
            <label class="mb-3 block font-medium">
              {{ $t('cvss.exploitCodeMaturity') }}
              <span class="ml-1 cursor-help" :title="$t('cvss.tooltip.E_Heading')">ⓘ</span>
            </label>
            <ToggleGroup
              v-model="cvssObj.E"
              :options="cvssItems.E"
              :disabled="readonly"
              class="group-btn"
            />
          </div>

          <!-- Remediation Level -->
          <div>
            <label class="mb-3 block font-medium">
              {{ $t('cvss.remediationLevel') }}
              <span class="ml-1 cursor-help" :title="$t('cvss.tooltip.RL_Heading')">ⓘ</span>
            </label>
            <ToggleGroup
              v-model="cvssObj.RL"
              :options="cvssItems.RL"
              :disabled="readonly"
              class="group-btn"
            />
          </div>

          <!-- Report Confidence -->
          <div>
            <label class="mb-3 block font-medium">
              {{ $t('cvss.reportConfidence') }}
              <span class="ml-1 cursor-help" :title="$t('cvss.tooltip.RC_Heading')">ⓘ</span>
            </label>
            <ToggleGroup
              v-model="cvssObj.RC"
              :options="cvssItems.RC"
              :disabled="readonly"
              class="group-btn"
            />
          </div>
        </div>

        <Separator class="my-6" />

        <!-- Environmental Metrics -->
        <div class="relative mb-4">
          <div class="flex items-center">
            <div class="flex-1">
              <span class="font-medium">
                {{ $t('cvss.environmentalTitle') }}
                <span class="ml-1 cursor-help" :title="$t('cvss.tooltip.environmentalMetricGroup_Legend')">ⓘ</span>
              </span>
            </div>

            <!-- Environmental Impact & Exploitability Scores -->
            <div v-if="cvss.environmentalModifiedImpact && cvss.environmentalModifiedExploitability" class="mr-32 flex gap-2">
              <Badge variant="secondary" class="bg-blue-900 text-white">
                {{ $t('cvss.environmentalModifiedImpact') }}:&nbsp;<span class="font-bold">{{ roundUp1(cvss.environmentalModifiedImpact) }}</span>
              </Badge>
              <Badge variant="secondary" class="bg-blue-900 text-white">
                {{ $t('cvss.environmentalModifiedExploitability') }}:&nbsp;<span class="font-bold">{{ roundUp1(cvss.environmentalModifiedExploitability) }}</span>
              </Badge>
            </div>

            <div class="scoreRating" :class="cvss.environmentalSeverity">
              <span v-if="!cvss.environmentalMetricScore" class="baseSeverity">{{ $t('cvss.infoWhenNoScore') }}</span>
              <div v-else>
                <span class="baseMetricScore">{{ cvss.environmentalMetricScore }}</span>
                <span class="baseSeverity">({{ cvss.environmentalSeverity }})</span>
              </div>
            </div>
          </div>
        </div>

        <Separator class="mb-6" />

        <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
          <!-- Environmental Requirements -->
          <div class="space-y-6">
            <!-- Confidentiality Requirement -->
            <div>
              <label class="mb-3 block font-medium">
                {{ $t('cvss.confidentialityRequirement') }}
                <span class="ml-1 cursor-help" :title="$t('cvss.tooltip.CR_Heading')">ⓘ</span>
              </label>
              <ToggleGroup
                v-model="cvssObj.CR"
                :options="cvssItems.CR"
                :disabled="readonly"
                class="group-btn"
              />
            </div>

            <!-- Integrity Requirement -->
            <div>
              <label class="mb-3 block font-medium">
                {{ $t('cvss.integrityRequirement') }}
                <span class="ml-1 cursor-help" :title="$t('cvss.tooltip.IR_Heading')">ⓘ</span>
              </label>
              <ToggleGroup
                v-model="cvssObj.IR"
                :options="cvssItems.IR"
                :disabled="readonly"
                class="group-btn"
              />
            </div>

            <!-- Availability Requirement -->
            <div>
              <label class="mb-3 block font-medium">
                {{ $t('cvss.availabilityRequirement') }}
                <span class="ml-1 cursor-help" :title="$t('cvss.tooltip.AR_Heading')">ⓘ</span>
              </label>
              <ToggleGroup
                v-model="cvssObj.AR"
                :options="cvssItems.AR"
                :disabled="readonly"
                class="group-btn"
              />
            </div>
          </div>

          <!-- Modified Base Metrics -->
          <div class="space-y-6">
            <!-- Modified Attack Vector -->
            <div>
              <label class="mb-3 block font-medium">
                {{ $t('cvss.modifiedAttackVector') }}
                <span class="ml-1 cursor-help" :title="$t('cvss.tooltip.MAV_Heading')">ⓘ</span>
              </label>
              <ToggleGroup
                v-model="cvssObj.MAV"
                :options="cvssItems.MAV"
                :disabled="readonly"
                class="group-btn"
              />
            </div>

            <!-- Modified Attack Complexity -->
            <div>
              <label class="mb-3 block font-medium">
                {{ $t('cvss.modifiedAttackComplexity') }}
                <span class="ml-1 cursor-help" :title="$t('cvss.tooltip.MAC_Heading')">ⓘ</span>
              </label>
              <ToggleGroup
                v-model="cvssObj.MAC"
                :options="cvssItems.MAC"
                :disabled="readonly"
                class="group-btn"
              />
            </div>

            <!-- Modified Privileges Required -->
            <div>
              <label class="mb-3 block font-medium">
                {{ $t('cvss.modifiedPrivilegesRequired') }}
                <span class="ml-1 cursor-help" :title="$t('cvss.tooltip.MPR_Heading')">ⓘ</span>
              </label>
              <ToggleGroup
                v-model="cvssObj.MPR"
                :options="cvssItems.MPR"
                :disabled="readonly"
                class="group-btn"
              />
            </div>

            <!-- Modified User Interaction -->
            <div>
              <label class="mb-3 block font-medium">
                {{ $t('cvss.modifiedUserInteraction') }}
                <span class="ml-1 cursor-help" :title="$t('cvss.tooltip.MUI_Heading')">ⓘ</span>
              </label>
              <ToggleGroup
                v-model="cvssObj.MUI"
                :options="cvssItems.MUI"
                :disabled="readonly"
                class="group-btn"
              />
            </div>

            <!-- Modified Scope -->
            <div>
              <label class="mb-3 block font-medium">
                {{ $t('cvss.modifiedScope') }}
                <span class="ml-1 cursor-help" :title="$t('cvss.tooltip.MS_Heading')">ⓘ</span>
              </label>
              <ToggleGroup
                v-model="cvssObj.MS"
                :options="cvssItems.MS"
                :disabled="readonly"
                class="group-btn"
              />
            </div>

            <!-- Modified Confidentiality -->
            <div>
              <label class="mb-3 block font-medium">
                {{ $t('cvss.modifiedConfidentialityImpact') }}
                <span class="ml-1 cursor-help" :title="$t('cvss.tooltip.MC_Heading')">ⓘ</span>
              </label>
              <ToggleGroup
                v-model="cvssObj.MC"
                :options="cvssItems.MC"
                :disabled="readonly"
                class="group-btn"
              />
            </div>

            <!-- Modified Integrity -->
            <div>
              <label class="mb-3 block font-medium">
                {{ $t('cvss.modifiedIntegrityImpact') }}
                <span class="ml-1 cursor-help" :title="$t('cvss.tooltip.MI_Heading')">ⓘ</span>
              </label>
              <ToggleGroup
                v-model="cvssObj.MI"
                :options="cvssItems.MI"
                :disabled="readonly"
                class="group-btn"
              />
            </div>

            <!-- Modified Availability -->
            <div>
              <label class="mb-3 block font-medium">
                {{ $t('cvss.modifiedAvailabilityImpact') }}
                <span class="ml-1 cursor-help" :title="$t('cvss.tooltip.MA_Heading')">ⓘ</span>
              </label>
              <ToggleGroup
                v-model="cvssObj.MA"
                :options="cvssItems.MA"
                :disabled="readonly"
                class="group-btn"
              />
            </div>
          </div>
        </div>
      </div>
    </Collapsible>
  </Card>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useSettings } from '@/composables/useSettings'
import Card from '@/components/ui/card.vue'
import Badge from '@/components/ui/badge.vue'
import Separator from '@/components/ui/separator.vue'
import ToggleGroup from '@/components/ui/toggle-group.vue'
import Collapsible from '@/components/ui/collapsible.vue'

// Import CVSS31 from public/js/cvsscalc31.js
// @ts-ignore - Global CVSS31 is loaded from public/js/cvsscalc31.js
declare const CVSS31: any

const settings = useSettings()

interface Props {
  modelValue?: string
  readonly?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: '',
  readonly: false,
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

interface CvssObject {
  AV: string
  AC: string
  PR: string
  UI: string
  S: string
  C: string
  I: string
  A: string
  E: string
  RL: string
  RC: string
  CR: string
  IR: string
  AR: string
  MAV: string
  MAC: string
  MPR: string
  MUI: string
  MS: string
  MC: string
  MI: string
  MA: string
  version?: string
}

const cvssItems = ref({
  AV: [
    { label: 'Network', value: 'N' },
    { label: 'Adjacent', value: 'A' },
    { label: 'Local', value: 'L' },
    { label: 'Physical', value: 'P' },
  ],
  AC: [
    { label: 'Low', value: 'L' },
    { label: 'High', value: 'H' },
  ],
  PR: [
    { label: 'None', value: 'N' },
    { label: 'Low', value: 'L' },
    { label: 'High', value: 'H' },
  ],
  UI: [
    { label: 'None', value: 'N' },
    { label: 'Required', value: 'R' },
  ],
  S: [
    { label: 'Unchanged', value: 'U' },
    { label: 'Changed', value: 'C' },
  ],
  C: [
    { label: 'None', value: 'N' },
    { label: 'Low', value: 'L' },
    { label: 'High', value: 'H' },
  ],
  I: [
    { label: 'None', value: 'N' },
    { label: 'Low', value: 'L' },
    { label: 'High', value: 'H' },
  ],
  A: [
    { label: 'None', value: 'N' },
    { label: 'Low', value: 'L' },
    { label: 'High', value: 'H' },
  ],
  // Temporal metrics
  E: [
    { label: 'Not Defined', value: 'X' },
    { label: 'Unproven', value: 'U' },
    { label: 'Proof-of-Concept', value: 'P' },
    { label: 'Functional', value: 'F' },
    { label: 'High', value: 'H' },
  ],
  RL: [
    { label: 'Not Defined', value: 'X' },
    { label: 'Official Fix', value: 'O' },
    { label: 'Temporary Fix', value: 'T' },
    { label: 'Workaround', value: 'W' },
    { label: 'Unavailable', value: 'U' },
  ],
  RC: [
    { label: 'Not Defined', value: 'X' },
    { label: 'Unknown', value: 'U' },
    { label: 'Reasonable', value: 'R' },
    { label: 'Confirmed', value: 'C' },
  ],
  // Environmental metrics
  CR: [
    { label: 'Not Defined', value: 'X' },
    { label: 'Low', value: 'L' },
    { label: 'Medium', value: 'M' },
    { label: 'High', value: 'H' },
  ],
  IR: [
    { label: 'Not Defined', value: 'X' },
    { label: 'Low', value: 'L' },
    { label: 'Medium', value: 'M' },
    { label: 'High', value: 'H' },
  ],
  AR: [
    { label: 'Not Defined', value: 'X' },
    { label: 'Low', value: 'L' },
    { label: 'Medium', value: 'M' },
    { label: 'High', value: 'H' },
  ],
  // Modified metrics
  MAV: [
    { label: 'Not Defined', value: 'X' },
    { label: 'Network', value: 'N' },
    { label: 'Adjacent', value: 'A' },
    { label: 'Local', value: 'L' },
    { label: 'Physical', value: 'P' },
  ],
  MAC: [
    { label: 'Not Defined', value: 'X' },
    { label: 'Low', value: 'L' },
    { label: 'High', value: 'H' },
  ],
  MPR: [
    { label: 'Not Defined', value: 'X' },
    { label: 'None', value: 'N' },
    { label: 'Low', value: 'L' },
    { label: 'High', value: 'H' },
  ],
  MUI: [
    { label: 'Not Defined', value: 'X' },
    { label: 'None', value: 'N' },
    { label: 'Required', value: 'R' },
  ],
  MS: [
    { label: 'Not Defined', value: 'X' },
    { label: 'Unchanged', value: 'U' },
    { label: 'Changed', value: 'C' },
  ],
  MC: [
    { label: 'Not Defined', value: 'X' },
    { label: 'None', value: 'N' },
    { label: 'Low', value: 'L' },
    { label: 'High', value: 'H' },
  ],
  MI: [
    { label: 'Not Defined', value: 'X' },
    { label: 'None', value: 'N' },
    { label: 'Low', value: 'L' },
    { label: 'High', value: 'H' },
  ],
  MA: [
    { label: 'Not Defined', value: 'X' },
    { label: 'None', value: 'N' },
    { label: 'Low', value: 'L' },
    { label: 'High', value: 'H' },
  ],
})

const cvssObj = ref<CvssObject>({
  AV: 'N',
  AC: 'L',
  PR: 'N',
  UI: 'N',
  S: 'U',
  C: 'N',
  I: 'N',
  A: 'N',
  E: 'X',
  RL: 'X',
  RC: 'X',
  CR: 'X',
  IR: 'X',
  AR: 'X',
  MAV: 'X',
  MAC: 'X',
  MPR: 'X',
  MUI: 'X',
  MS: 'X',
  MC: 'X',
  MI: 'X',
  MA: 'X',
})

const cvss = ref<any>({})

const roundUp1 = (n: number) => {
  return CVSS31.roundUp1(n)
}

const cvssStrToObject = (str: string) => {
  if (str) {
    const temp = str.split('/')
    for (let i = 0; i < temp.length; i++) {
      const elt = temp[i].split(':')
      if (cvssObj.value.hasOwnProperty(elt[0])) {
        cvssObj.value[elt[0]] = elt[1] || ''
      }
    }
  }
}

const cvssObjectToStr = () => {
  let vectorString = `CVSS:${  cvssObj.value.version}`
  for (const key in cvssObj.value) {
    if (key !== 'version' && cvssObj.value[key]) {
      vectorString += `/${key}:${cvssObj.value[key]}`
    }
  }
  cvss.value = CVSS31.calculateCVSSFromVector(vectorString)
  emit('update:modelValue', vectorString)
}

onMounted(() => {
  cvssStrToObject(props.modelValue)
  cvss.value = CVSS31.calculateCVSSFromVector(props.modelValue)
})

</script>

<style scoped>
.group-btn .inline-flex button {
  border: 1px solid #ccc;
  font-weight: 400;
}

.baseSeverity {
  font-size: 16px;
  font-weight: normal;
  margin-bottom: 5px;
  display: block;
}

.baseMetricScore {
  display: block;
  font-size: 32px;
  line-height: 32px;
  font-weight: normal;
  margin-top: 4px;
}

.scoreRating {
  width: 100px;
  top: -4px;
  right: 20px;
  border: 2px solid #666666;
  background: #dddddd;
  font-size: 11px;
  border-radius: 10px;
  line-height: 150%;
  text-align: center;
  height: fit-content !important;
  position: absolute;
}

.scoreRating.None {
  background: #53aa33;
  border: 2px solid #53aa33;
  color: white;
}

.scoreRating.Low {
  background: #ffcb0d;
  border: 2px solid #ffcb0d;
  color: white;
}

.scoreRating.Medium {
  background: #f9a009;
  border: 2px solid #f9a009;
  color: white;
}

.scoreRating.High {
  background: #df3d03;
  border: 2px solid #df3d03;
  color: white;
}

.scoreRating.Critical {
  background: #212121;
  border: 2px solid #212121;
  color: white;
}
</style>
