package com.zxh.official

import android.annotation.SuppressLint
import android.app.Activity
import android.content.Intent
import android.graphics.Color
import android.net.Uri
import android.os.Bundle
import android.view.View
import android.view.Window
import android.webkit.ValueCallback
import android.webkit.WebChromeClient
import android.webkit.WebResourceRequest
import android.webkit.WebView
import android.webkit.WebViewClient
import android.widget.Toast

class MainActivity : Activity() {
    private lateinit var webView: WebView
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
            setSupportMultipleWindows(false)
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
                val uri = request.url
                return if (uri.scheme == "https" && uri.host == Uri.parse(startUrl).host) {
                    false
                } else if (uri.scheme == "http" || uri.scheme == "https") {
                    try {
                        startActivity(Intent(Intent.ACTION_VIEW, uri))
                    } catch (_: Exception) {
                        Toast.makeText(this@MainActivity, "Unable to open this link", Toast.LENGTH_SHORT).show()
                    }
                    true
                } else {
                    true
                }
            }
        }

        webView.webChromeClient = object : WebChromeClient() {
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

    @Deprecated("Deprecated in Android API, retained for compatibility")
    override fun onBackPressed() {
        if (::webView.isInitialized && webView.canGoBack()) {
            webView.goBack()
        } else {
            super.onBackPressed()
        }
    }

    override fun onDestroy() {
        uploadCallback?.onReceiveValue(null)
        webView.destroy()
        super.onDestroy()
    }
}
