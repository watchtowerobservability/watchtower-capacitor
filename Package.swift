// swift-tools-version:5.9
import PackageDescription

let package = Package(
    name: "WatchtowerobservabilityCapacitor",
    platforms: [.iOS(.v13)],
    products: [.library(name: "WatchtowerobservabilityCapacitor", targets: ["WatchtowerPlugin"])],
    dependencies: [
        .package(url: "https://github.com/ionic-team/capacitor-swift-pm.git", from: "6.0.0"),
        .package(url: "https://github.com/watchtowerobservability/watchtower-ios", from: "0.1.0"),
    ],
    targets: [
        .target(
            name: "WatchtowerPlugin",
            dependencies: [
                .product(name: "Capacitor", package: "capacitor-swift-pm"),
                .product(name: "Cordova", package: "capacitor-swift-pm"),
                .product(name: "Watchtower", package: "watchtower-ios"),
            ],
            path: "ios/Sources/WatchtowerPlugin"
        ),
    ]
)
