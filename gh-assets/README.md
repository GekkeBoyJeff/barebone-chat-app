# Not ignoring the real time stack

In deze tekst wordt de focus gelegd op het ontwerpen van een product dat mensen graag gebruiken. Er worden vijf basisstates besproken en echte praktijkvoorbeelden gegeven. Voor meer informatie, bekijk [hva boeken online lezen](https://chat.openai.com/bib.hva.nl).

## The five base states

Je applicatie wisselt voortdurend tussen deze 5 states:

1.  **Empty state (initial state):** Dit is de eerste keer dat de HTML wordt ingeladen.
    1.  Schakel de class in als er geen verbinding is. Zodra er verbinding is, kun je de class negeren.
    2.  Er zijn 3 versies:
        1.  First use (onboarding)
        2.  Cleared data (empty inbox, maar wel eerder gebruikt)
        3.  Nothing to show (no result)
    
2.  **Loading state:** Deze wordt vaak over het hoofd gezien, maar in games wordt hier veel aandacht aan besteed, zodat je tijdens het laden bijvoorbeeld tips kunt zien. Je kunt ook verwachtingen neerzetten met een loading state, zoals een skeleton.
    
3.  **Partial state:** Een gedeelte van de informatie is ingeladen. De pagina is niet leeg maar ook niet geheel gevuld. Het doel hiervan is om te zorgen dat mensen niet ontmoedigd raken en de pagina sluiten. Een skeleton is een voorbeeld dat je kunt gebruiken. Je kunt micro-interacties maken om mensen te helpen de waarde van je product te zien.
    
4.  **Error state:** Het scherm waar je naartoe gaat als er iets misgaat, zoals:
    
    1.  Missing or invalid form data
    2.  No client/server connection
    3.  Moving forward without finishing
    4.  Leaving a page without text submitted
    5.  Etc.
5.  **Ideal state:** Hierin staat je ideale applicatie of het uiteindelijke doel, waarin het doet wat het moet doen. Je mag hier placeholders meegeven om data te simuleren (een skeleton gebruiken dus).


