<script setup lang="ts">
import { useI18n } from "vue-i18n";
import { ref, reactive } from "vue";
import Motion from "../utils/motion";
import { message } from "@/utils/message";
import { phoneRules } from "../utils/rule";
import type { FormInstance } from "element-plus";
import { $t, transformI18n } from "@/plugins/i18n";
import { useVerifyCode } from "../utils/verifyCode";
import { useUserStoreHook } from "@/store/modules/user";
import { useRenderIcon } from "@/components/ReIcon/src/hooks";
import Iphone from "@iconify-icons/ep/iphone";
import { getVerifyCode } from "@/api/user";
import { initRouter, getTopMenu } from "@/router/utils";
import { useRouter } from "vue-router";

const { t } = useI18n();
const loading = ref(false);
const ruleForm = reactive({
  phone: "",
  verifyCode: ""
});
const ruleFormRef = ref<FormInstance>();
const router = useRouter();
const { isDisabled, text } = useVerifyCode();
let verifyId = "";
const onLogin = async (formEl: FormInstance | undefined) => {
  loading.value = true;
  if (!formEl) return;
  await formEl.validate(async (valid, fields) => {
    if (valid) {
      useUserStoreHook()
        .loginByPhone(ruleForm.phone, ruleForm.verifyCode, verifyId)
        .then(res => {
          if (res.k_error === 0) {
            return initRouter().then(() => {
              console.log("login successful,go to :", getTopMenu(true).path);
              router.push(getTopMenu(true).path);
              message("登录成功", { type: "success" });
            });
          }
        })
        .catch(e => {
          message(e, { type: "error" });
        })
        .finally(() => (loading.value = false));
    } else {
      loading.value = false;
      return fields;
    }
  });
};

function onBack() {
  useVerifyCode().end();
  useUserStoreHook().SET_CURRENTPAGE(0);
}

const onVerifyCode = async ruleFormRef => {
  useVerifyCode().start(ruleFormRef, "phone");
  try {
    const { data } = await getVerifyCode(ruleForm.phone);
    if (data.result === 0) {
      verifyId = data.verify_id;
    }
  } catch (e) {
    console.log(e);
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <el-form ref="ruleFormRef" :model="ruleForm" :rules="phoneRules" size="large">
    <Motion>
      <el-form-item prop="phone">
        <el-input
          v-model="ruleForm.phone"
          clearable
          :placeholder="t('login.phone')"
          :prefix-icon="useRenderIcon(Iphone)"
        />
      </el-form-item>
    </Motion>

    <Motion :delay="100">
      <el-form-item prop="verifyCode">
        <div class="w-full flex justify-between">
          <el-input
            v-model="ruleForm.verifyCode"
            clearable
            :placeholder="t('login.smsVerifyCode')"
            :prefix-icon="useRenderIcon('ri:shield-keyhole-line')"
          />
          <el-button
            :disabled="isDisabled"
            class="ml-2"
            @click="onVerifyCode(ruleFormRef)"
          >
            {{
              text.length > 0
                ? text + t("login.info")
                : t("login.getVerifyCode")
            }}
          </el-button>
        </div>
      </el-form-item>
    </Motion>

    <Motion :delay="150">
      <el-form-item>
        <el-button
          class="w-full"
          size="default"
          type="primary"
          :loading="loading"
          @click="onLogin(ruleFormRef)"
        >
          {{ t("login.login") }}
        </el-button>
      </el-form-item>
    </Motion>
  </el-form>
</template>
