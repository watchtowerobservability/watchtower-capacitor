package dev.watchtower.capacitor

import com.getcapacitor.Plugin
import com.getcapacitor.PluginCall
import com.getcapacitor.PluginMethod
import com.getcapacitor.annotation.CapacitorPlugin
import dev.watchtower.Config
import dev.watchtower.ReplayConfig
import dev.watchtower.Watchtower

/** Bridge to the native Android SDK: crashes, ANR, app start, frame metrics and screenshot replay. */
@CapacitorPlugin(name = "Watchtower")
class WatchtowerPlugin : Plugin() {
    @PluginMethod
    fun init(call: PluginCall) {
        val key = call.getString("key")
        val service = call.getString("service")
        val endpoint = call.getString("endpoint")
        if (key == null || service == null || endpoint == null) {
            call.reject("key, service and endpoint are required")
            return
        }
        Watchtower.init(
            activity.application,
            Config(
                key = key,
                service = service,
                endpoint = endpoint,
                release = call.getString("release"),
                environment = call.getString("environment"),
                replay = ReplayConfig(enabled = call.getBoolean("replay", false) == true),
            ),
        )
        call.resolve()
    }

    @PluginMethod
    fun flush(call: PluginCall) {
        Watchtower.flush()
        call.resolve()
    }
}
