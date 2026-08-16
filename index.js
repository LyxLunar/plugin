({
  onLoad() {
    console.log("[CloudCord Cosmetics] v2 loaded");
  },

  onUnload() {
    console.log("[CloudCord Cosmetics] unloaded");
  },

  settings: () => {
    const React = vendetta.common.React;
    const RN = vendetta.common.ReactNative;
    const storage = vendetta.plugin.storage;

    const [frame, setFrame] = React.useState(storage.frame || "none");
    const [effect, setEffect] = React.useState(storage.effect || "none");

    React.useEffect(() => {
      storage.frame = frame;
      storage.effect = effect;
    }, [frame, effect]);

    const frames = [
      ["none", "None"],
      ["stars", "Starry"],
      ["crown", "Crown"],
      ["neon", "Neon"],
      ["crystal", "Crystal"]
    ];

    const effects = [
      ["none", "None"],
      ["sparkles", "Sparkles"],
      ["aurora", "Aurora"],
      ["flames", "Flames"],
      ["snow", "Snow"]
    ];

    const makeButton = (id, name, current, setter) =>
      React.createElement(
        RN.Pressable,
        {
          key: id,
          onPress: () => setter(id),
          style: {
            padding: 14,
            borderRadius: 12,
            marginBottom: 8,
            backgroundColor: current === id ? "#5865F2" : "#1E1F22"
          }
        },
        React.createElement(
          RN.Text,
          {
            style: {
              color: "#FFF",
              fontWeight: "700",
              fontSize: 15
            }
          },
          (current === id ? "✓ " : "") + name
        )
      );

    return React.createElement(
      RN.ScrollView,
      {
        style: { flex: 1 },
        contentContainerStyle: { padding: 16, paddingBottom: 40 }
      },

      React.createElement(
        RN.Text,
        {
          style: {
            color: "#FFF",
            fontSize: 26,
            fontWeight: "800"
          }
        },
        "CloudCord Cosmetics"
      ),

      React.createElement(
        RN.Text,
        {
          style: {
            color: "#AAA",
            marginTop: 4,
            marginBottom: 18
          }
        },
        "Local cosmetic preview system"
      ),

      React.createElement(
        RN.View,
        {
          style: {
            backgroundColor: "#2B2D31",
            borderRadius: 14,
            padding: 14,
            marginBottom: 18
          }
        },

        React.createElement(
          RN.Text,
          {
            style: {
              color: "#FFF",
              fontWeight: "800",
              marginBottom: 8
            }
          },
          "Preview"
        ),

        React.createElement(
          RN.Text,
          { style: { color: "#DDD" } },
          "Frame: " + frame
        ),

        React.createElement(
          RN.Text,
          { style: { color: "#DDD", marginTop: 2 } },
          "Effect: " + effect
        )
      ),

      React.createElement(
        RN.Text,
        {
          style: {
            color: "#FFF",
            fontSize: 18,
            fontWeight: "800",
            marginBottom: 10
          }
        },
        "Avatar Frames"
      ),

      ...frames.map(([id, name]) =>
        makeButton(id, name, frame, setFrame)
      ),

      React.createElement(
        RN.Text,
        {
          style: {
            color: "#FFF",
            fontSize: 18,
            fontWeight: "800",
            marginTop: 12,
            marginBottom: 10
          }
        },
        "Profile Effects"
      ),

      ...effects.map(([id, name]) =>
        makeButton(id, name, effect, setEffect)
      ),

      React.createElement(
        RN.Text,
        {
          style: {
            color: "#777",
            fontSize: 12,
            marginTop: 16,
            lineHeight: 18
          }
        },
        "Selections are saved locally on your device."
      )
    );
  }
})
