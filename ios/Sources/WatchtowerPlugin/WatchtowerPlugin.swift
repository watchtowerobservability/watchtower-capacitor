import Capacitor
import Watchtower

/// Bridge to the native iOS SDK: crashes, hangs, app start, frame metrics and screenshot replay.
@objc(WatchtowerPlugin)
public class WatchtowerPlugin: CAPPlugin, CAPBridgedPlugin {
    public let identifier = "WatchtowerPlugin"
    public let jsName = "Watchtower"
    public let pluginMethods: [CAPPluginMethod] = [
        CAPPluginMethod(name: "init", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "flush", returnType: CAPPluginReturnPromise),
    ]

    @objc func `init`(_ call: CAPPluginCall) {
        guard let key = call.getString("key"), let service = call.getString("service"),
              let endpoint = call.getString("endpoint") else {
            call.reject("key, service and endpoint are required")
            return
        }
        var cfg = Config(key: key, service: service)
        cfg.endpoint = endpoint
        cfg.release = call.getString("release")
        cfg.environment = call.getString("environment")
        cfg.replay.enabled = call.getBool("replay") ?? false
        Watchtower.start(cfg)
        call.resolve()
    }

    @objc func flush(_ call: CAPPluginCall) {
        Watchtower.shared.flush()
        call.resolve()
    }
}
