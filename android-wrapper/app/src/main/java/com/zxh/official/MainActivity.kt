package com.zxh.official

import android.annotation.SuppressLint
import android.app.Activity
import android.content.Intent
import android.graphics.Color
import android.net.Uri
import android.os.Bundle
import android.view.View
import android.view.ViewGroup
import android.widget.FrameLayout
import android.view.Window
import android.webkit.ValueCallback
import android.webkit.WebChromeClient
import android.webkit.WebResourceRequest
import android.webkit.WebView
import android.webkit.WebViewClient
import android.widget.Toast

class MainActivity : Activity() {
    private lateinit var webView: WebView
    private lateinit var rootLayout: FrameLayout
    private var toolWebView: WebView? = null
    private var uploadCallback: ValueCallback<Array<Uri>>? = null
    private val fileRequestCode = 4107
    private val startUrl = "https://zxh-official-tools-hub.vercel.app/?nativeApp=1"

    @SuppressLint("SetJavaScriptEnabled")
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        window.statusBarColor = Color.rgb(255, 45, 141)
        window.navigationBarColor = Color.rgb(255, 45, 141)
        window.decorView.systemUiVisibility = 0
        if (android.os.Build.VERSION.SDK_INT >= 28) {
            window.navigationBarDividerColor = Color.rgb(255, 45, 141)
        }

        webView = WebView(this)
        webView.setBackgroundColor(Color.WHITE)
        webView.settings.apply {
            javaScriptEnabled = true
            domStorageEnabled = true
            databaseEnabled = true
            loadsImagesAutomatically = true
            useWideViewPort = true
            loadWithOverviewMode = false
            javaScriptCanOpenWindowsAutomatically = true
            setSupportMultipleWindows(true)
            allowFileAccess = false
            allowContentAccess = true
            mediaPlaybackRequiresUserGesture = true
        }

        webView.webViewClient = object : WebViewClient() {
            override fun onPageFinished(view: WebView, url: String) {
                super.onPageFinished(view, url)
                // Keep the website's PWA install overlay hidden inside this native Android app.
                val hideInstallPopup = """
                    (function() {
                      var styleId = 'zxh-native-hide-install-popup';
                      if (!document.getElementById(styleId)) {
                        var style = document.createElement('style');
                        style.id = styleId;
                        style.textContent = '#installPromptOverlay,.install-overlay{display:none!important;visibility:hidden!important;opacity:0!important;pointer-events:none!important}';
                        (document.head || document.documentElement).appendChild(style);
                      }
                      var hide = function() {
                        var popup = document.getElementById('installPromptOverlay');
                        if (popup) {
                          popup.style.setProperty('display','none','important');
                          popup.style.setProperty('visibility','hidden','important');
                        }
                        document.querySelectorAll('.install-overlay').forEach(function(el) {
                          el.style.setProperty('display','none','important');
                          el.style.setProperty('visibility','hidden','important');
                        });
                      };
                      hide();
                      if (!window.__zxhInstallPopupObserver && document.documentElement) {
                        window.__zxhInstallPopupObserver = new MutationObserver(hide);
                        window.__zxhInstallPopupObserver.observe(document.documentElement,{childList:true,subtree:true});
                      }
                    })();
                """.trimIndent()
                view.evaluateJavascript(hideInstallPopup, null)
            }

            override fun shouldOverrideUrlLoading(view: WebView, request: WebResourceRequest): Boolean {
                // Keep every normal website link inside this WebView; never hand it to Chrome.
                // Block non-web schemes so external apps are not launched unexpectedly.
                val scheme = request.url.scheme?.lowercase()
                return scheme != "http" && scheme != "https"
            }
        }

        webView.webChromeClient = object : WebChromeClient() {\n            override fun onCreateWindow(\n                view: WebView,\n                isDialog: Boolean,\n                isUserGesture: Boolean,\n                resultMsg: android.os.Message\n            ): Boolean {\n                // Open tool links (window.open / target=_blank) in a second WebView.\n                // Keep the original homepage WebView alive underneath so Back restores\n                // its exact scroll position and React state without reloading the site.\n                closeToolWebView()\n                val child = WebView(this@MainActivity)\n                child.setBackgroundColor(Color.WHITE)\n                child.settings.apply {\n                    javaScriptEnabled = true\n                    domStorageEnabled = true\n                    databaseEnabled = true\n                    loadsImagesAutomatically = true\n                    useWideViewPort = true\n                    loadWithOverviewMode = false\n                    javaScriptCanOpenWindowsAutomatically = true\n                    setSupportMultipleWindows(false)\n                    allowFileAccess = false\n                    allowContentAccess = true\n                    mediaPlaybackRequiresUserGesture = true\n                }\n                child.webViewClient = object : WebViewClient() {\n                    override fun shouldOverrideUrlLoading(view: WebView, request: WebResourceRequest): Boolean {\n                        val scheme = request.url.scheme?.lowercase()\n                        return scheme != "http" && scheme != "https"\n                    }\n                }\n                child.webChromeClient = this\n                toolWebView = child\n                webView.visibility = View.GONE\n                rootLayout.addView(child, FrameLayout.LayoutParams(\n                    ViewGroup.LayoutParams.MATCH_PARENT,\n                    ViewGroup.LayoutParams.MATCH_PARENT\n                ))\n                val transport = resultMsg.obj as WebView.WebViewTransport\n                transport.webView = child\n                resultMsg.sendToTarget()\n                return true\n            }\n\n            override fun onCloseWindow(window: WebView) {\n                closeToolWebView()\n            }\n
            override fun onShowFileChooser(
                view: WebView,
                filePathCallback: ValueCallback<Array<Uri>>,
                fileChooserParams: FileChooserParams
            ): Boolean {
                uploadCallback?.onReceiveValue(null)
                uploadCallback = filePathCallback
                return try {
                    startActivityForResult(fileChooserParams.createIntent(), fileRequestCode)
                    true
                } catch (_: Exception) {
                    uploadCallback = null
                    false
                }
            }
        }

        setContentView(webView)
        if (savedInstanceState != null) {
            webView.restoreState(savedInstanceState)
        } else {
            webView.loadUrl(startUrl)
        }
    }

    @Deprecated("Deprecated in Android API, retained for broad device compatibility")
    override fun onActivityResult(requestCode: Int, resultCode: Int, data: Intent?) {
        super.onActivityResult(requestCode, resultCode, data)
        if (requestCode == fileRequestCode) {
            val result = if (resultCode == Activity.RESULT_OK && data != null) {
                data.clipData?.let { clip ->
                    Array(clip.itemCount) { index -> clip.getItemAt(index).uri }
                } ?: data.data?.let { arrayOf(it) }
            } else null
            uploadCallback?.onReceiveValue(result)
            uploadCallback = null
        }
    }

    override fun onSaveInstanceState(outState: Bundle) {
        webView.saveState(outState)
        super.onSaveInstanceState(outState)
    }

    private fun isHomePage(url: String?): Boolean {
        if (url.isNullOrBlank()) return true
        return try {
            val current = Uri.parse(url)
            val homeHost = Uri.parse(startUrl).host
            current.host.equals(homeHost, ignoreCase = true) &&
                (current.path.isNullOrBlank() || current.path == "/" || current.path == "/index.html")
        } catch (_: Exception) {
            false
        }
    }

    @Deprecated("Deprecated in Android API, retained for compatibility")
    override fun onBackPressed() {
        if (!::webView.isInitialized) {
            super.onBackPressed()
            return
        }

        // At the homepage, exit instead of walking through duplicate homepage/redirect entries.
        if (isHomePage(webView.url)) {
            finish()
            return
        }

        if (webView.canGoBack()) {
            webView.goBack()
        } else {
            finish()
        }
    }

    override fun onDestroy() {
        uploadCallback?.onReceiveValue(null)
        webView.destroy()
        super.onDestroy()
    }
}
