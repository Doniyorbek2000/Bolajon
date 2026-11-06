package expo.modules.kidlock

import android.app.ActivityManager
import android.content.Context
import io.github.expo.modules.v2.ExpoModule
import io.github.expo.modules.v2.JS
import io.github.expo.modules.v2.Module
import io.github.expo.modules.v2.react.androidContext
import io.github.expo.modules.v2.react.currentActivity
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext

/**
 * Bola rejimi: ilovani ekranga mahkamlash (Android "screen pinning" / lock task).
 * Mahkamlanganda Home va Orqaga tugmalari ilovadan chiqarmaydi. Tizim sozlamasida
 * "Chiqarishdan oldin PIN so'rash" yoqilgan bo'lsa, qulfni faqat telefon paroli bilan ochish mumkin.
 */
@ExpoModule("KidLock")
class KidLockModule : Module() {
  @JS
  suspend fun start(): Boolean = withContext(Dispatchers.Main) {
    val activity = currentActivity ?: return@withContext false
    try {
      activity.startLockTask()
      true
    } catch (e: Exception) {
      false
    }
  }

  @JS
  suspend fun stop(): Boolean = withContext(Dispatchers.Main) {
    val activity = currentActivity ?: return@withContext false
    try {
      activity.stopLockTask()
      true
    } catch (e: Exception) {
      false
    }
  }

  @JS
  fun isLocked(): Boolean {
    val am = androidContext.getSystemService(Context.ACTIVITY_SERVICE) as ActivityManager
    return am.lockTaskModeState != ActivityManager.LOCK_TASK_MODE_NONE
  }
}
