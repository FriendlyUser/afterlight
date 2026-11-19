package io.github.friendlyuser.afterlight;

import android.os.Bundle;
import android.view.WindowManager;
import android.webkit.WebSettings;

import androidx.core.view.WindowCompat;
import androidx.core.view.WindowInsetsCompat;
import androidx.core.view.WindowInsetsControllerCompat;

import com.getcapacitor.BridgeActivity;

/**
 * The whole game is the web build inside Capacitor's WebView. This activity only sets
 * what a game needs from the device: a scalable page, a screen that stays on, and
 * fullscreen that comes back after the player swipes the system bars in.
 */
public class MainActivity extends BridgeActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        // The UI is laid out for a window at least 1280 x 720. src/platform/Device.js
        // asks for that size with a viewport meta tag; a WebView ignores the tag unless
        // the wide viewport is switched on.
        if (getBridge() != null && getBridge().getWebView() != null) {
            WebSettings settings = getBridge().getWebView().getSettings();
            settings.setUseWideViewPort(true);
            settings.setLoadWithOverviewMode(true);
        }

        // Cutscenes run for minutes without a touch.
        getWindow().addFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON);
        hideSystemBars();
    }

    @Override
    public void onWindowFocusChanged(boolean hasFocus) {
        super.onWindowFocusChanged(hasFocus);
        if (hasFocus) hideSystemBars();
    }

    /** Immersive mode: a swipe from the edge shows the bars for a moment, then they hide again. */
    private void hideSystemBars() {
        WindowInsetsControllerCompat controller = WindowCompat.getInsetsController(getWindow(), getWindow().getDecorView());
        controller.setSystemBarsBehavior(WindowInsetsControllerCompat.BEHAVIOR_SHOW_TRANSIENT_BARS_BY_SWIPE);
        controller.hide(WindowInsetsCompat.Type.systemBars());
    }
}
